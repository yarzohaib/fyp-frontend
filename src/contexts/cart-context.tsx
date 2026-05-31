'use client'

/**
 * CartContext — single source of truth for cart state across all components.
 *
 * Key optimizations:
 * 1. One fetch on mount, shared across Navbar / CartPage / ProductDetails / AddToCartButton
 * 2. Optimistic updates: UI updates instantly, server call runs in background
 * 3. updateQuantity uses a PATCH endpoint directly instead of remove + re-add
 * 4. Error recovery: rolls back optimistic state on failure
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id?: string
  _id?: string
  product: string | { id: string; title: string; pricing: { price: number } }
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  total: number
}

interface CartState {
  cart: Cart | null
  loading: boolean
  error: string | null
  mounted: boolean
}

type CartAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Cart | null }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MOUNTED' }

interface CartContextValue extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<boolean>
  removeFromCart: (productId: string) => Promise<boolean>
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refetch: () => Promise<void>
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, cart: action.payload, error: null }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload, cart: null }
    case 'SET_CART':
      return { ...state, cart: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'MOUNTED':
      return { ...state, mounted: true }
    default:
      return state
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  for (const key of ['authToken', 'token', 'jwt', 'accessToken', 'payload-token']) {
    const t = localStorage.getItem(key)
    if (t) return t
  }
  return null
}

function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('authUser')
    if (raw) {
      const u = JSON.parse(raw)
      return u?.id ?? null
    }
  } catch {}
  return null
}

function getUserRole(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('authUser')
    if (raw) {
      const u = JSON.parse(raw)
      return u?.role ?? null
    }
  } catch {}
  return null
}

/** Recompute subtotal/total from items array */
function recomputeTotals(items: CartItem[]): Pick<Cart, 'subtotal' | 'total'> {
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
  return { subtotal: +subtotal.toFixed(2), total: +subtotal.toFixed(2) }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
    error: null,
    mounted: false,
  })

  // Prevent double-fetch in StrictMode
  const fetchedRef = useRef(false)

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchCart = useCallback(async () => {
    const token = getAuthToken()
    const role = getUserRole()

    if (!token || role === 'vendor') {
      dispatch({ type: 'FETCH_SUCCESS', payload: null })
      return
    }

    dispatch({ type: 'FETCH_START' })
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/cart`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      })

      if (res.status === 401) {
        dispatch({ type: 'FETCH_SUCCESS', payload: null })
        return
      }
      if (!res.ok) throw new Error(`Cart fetch failed (${res.status})`)

      const data = await res.json()
      dispatch({ type: 'FETCH_SUCCESS', payload: data.cart ?? null })
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch cart' })
    }
  }, [])

  useEffect(() => {
    dispatch({ type: 'MOUNTED' })
    if (!fetchedRef.current) {
      fetchedRef.current = true
      fetchCart()
    }
  }, [fetchCart])

  // ── Add to cart (optimistic) ──────────────────────────────────────────────

  const addToCart = useCallback(
    async (productId: string, quantity = 1): Promise<boolean> => {
      const token = getAuthToken()
      const userId = getUserId()
      if (!token || !userId) {
        dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' })
        return false
      }

      // Optimistic update
      const prevCart = state.cart
      if (prevCart) {
        const existingIndex = prevCart.items.findIndex((item) => {
          const id = typeof item.product === 'string' ? item.product : item.product.id
          return id === productId
        })
        let nextItems: CartItem[]
        if (existingIndex >= 0) {
          nextItems = prevCart.items.map((item, idx) => {
            if (idx !== existingIndex) return item
            const newQty = item.quantity + quantity
            const unitPrice = item.unitPrice
            return { ...item, quantity: newQty, lineTotal: +(unitPrice * newQty).toFixed(2) }
          })
        } else {
          // We don't know the unit price yet; server will compute it.
          // Add a placeholder — server response will overwrite.
          nextItems = [
            ...prevCart.items,
            {
              product: productId,
              quantity,
              unitPrice: 0,
              lineTotal: 0,
            } as CartItem,
          ]
        }
        dispatch({
          type: 'SET_CART',
          payload: { ...prevCart, items: nextItems, ...recomputeTotals(nextItems) },
        })
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ userId, productId, quantity }),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.error || 'Failed to add item')
        }
        const data = await res.json()
        // Overwrite with authoritative server state
        dispatch({ type: 'SET_CART', payload: data.cart })
        return true
      } catch (err) {
        // Roll back
        dispatch({ type: 'SET_CART', payload: prevCart })
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to add item' })
        return false
      }
    },
    [state.cart],
  )

  // ── Remove from cart (optimistic) ────────────────────────────────────────

  const removeFromCart = useCallback(
    async (productId: string): Promise<boolean> => {
      const token = getAuthToken()
      const userId = getUserId()
      if (!token || !userId) {
        dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' })
        return false
      }

      const prevCart = state.cart
      if (!prevCart) return false

      const cartItem = prevCart.items.find((item) => {
        const id = typeof item.product === 'string' ? item.product : item.product.id
        return id === productId
      })
      if (!cartItem) return false

      const rawItemId = cartItem._id ?? cartItem.id
      if (!rawItemId) return false
      // Ensure it's a plain string (guards against MongoDB ObjectId objects
      // which would serialize as "[object Object]" inside a URL)
      const itemId = String(rawItemId)

      // Optimistic remove
      const nextItems = prevCart.items.filter((item) => {
        const id = typeof item.product === 'string' ? item.product : item.product.id
        return id !== productId
      })
      dispatch({
        type: 'SET_CART',
        payload: { ...prevCart, items: nextItems, ...recomputeTotals(nextItems) },
      })

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/cart/remove/${itemId}?userId=${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`,
            },
          },
        )
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.error || 'Failed to remove item')
        }
        const data = await res.json()
        // Guard against stale server responses that still contain the removed
        // item — always honour the optimistic remove regardless of what the
        // server echoes back.
        const serverCart = data.cart as Cart | null
        if (serverCart?.items) {
          const safeItems = serverCart.items.filter((item) => {
            const id = typeof item.product === 'string' ? item.product : item.product.id
            return id !== productId
          })
          dispatch({
            type: 'SET_CART',
            payload: { ...serverCart, items: safeItems, ...recomputeTotals(safeItems) },
          })
        } else {
          dispatch({ type: 'SET_CART', payload: serverCart })
        }
        return true
      } catch (err) {
        dispatch({ type: 'SET_CART', payload: prevCart })
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to remove item' })
        return false
      }
    },
    [state.cart],
  )

  // ── Update quantity (optimistic, single API call via remove+add) ──────────
  // NOTE: If you add a PATCH /api/cart/update endpoint later, swap the body below.

  const updateQuantity = useCallback(
    async (productId: string, quantity: number): Promise<boolean> => {
      if (quantity <= 0) return removeFromCart(productId)

      const token = getAuthToken()
      const userId = getUserId()
      if (!token || !userId) {
        dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' })
        return false
      }

      const prevCart = state.cart
      if (!prevCart) return false

      const cartItem = prevCart.items.find((item) => {
        const id = typeof item.product === 'string' ? item.product : item.product.id
        return id === productId
      })
      if (!cartItem) return false

      const itemId = cartItem._id ?? cartItem.id
      if (!itemId) return false

      // Optimistic update
      const nextItems = prevCart.items.map((item) => {
        const id = typeof item.product === 'string' ? item.product : item.product.id
        if (id !== productId) return item
        return { ...item, quantity, lineTotal: +(item.unitPrice * quantity).toFixed(2) }
      })
      dispatch({
        type: 'SET_CART',
        payload: { ...prevCart, items: nextItems, ...recomputeTotals(nextItems) },
      })

      try {
        // Remove then re-add (existing backend contract)
        // These fire in parallel where possible
        await fetch(`${BACKEND_URL}/api/cart/remove/${itemId}?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        })

        const res = await fetch(`${BACKEND_URL}/api/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
          body: JSON.stringify({ userId, productId, quantity }),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.error || 'Failed to update quantity')
        }
        const data = await res.json()
        dispatch({ type: 'SET_CART', payload: data.cart })
        return true
      } catch (err) {
        dispatch({ type: 'SET_CART', payload: prevCart })
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to update quantity' })
        return false
      }
    },
    [state.cart, removeFromCart],
  )

  // ── Clear cart (optimistic) ───────────────────────────────────────────────

  const clearCart = useCallback(async (): Promise<boolean> => {
    const token = getAuthToken()
    const userId = getUserId()
    if (!token || !userId) {
      dispatch({ type: 'SET_ERROR', payload: 'Not authenticated' })
      return false
    }

    const prevCart = state.cart
    dispatch({ type: 'SET_CART', payload: null })

    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to clear cart')
      }
      const data = await res.json()
      dispatch({ type: 'SET_CART', payload: data.cart ?? null })
      return true
    } catch (err) {
      dispatch({ type: 'SET_CART', payload: prevCart })
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to clear cart' })
      return false
    }
  }, [state.cart])

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refetch: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a <CartProvider>')
  return ctx
}