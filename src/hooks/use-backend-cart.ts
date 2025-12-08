'use client'

import { useState, useEffect, useCallback } from 'react'

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

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export function useBackendCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Simple utility functions - no useCallback needed
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null
    
    const keys = ["authToken", "token", "jwt", "accessToken", "payload-token"]
    for (const key of keys) {
      const token = localStorage.getItem(key)
      if (token) {
        //console.log(`✓ Auth token found from localStorage key: ${key}`)
        return token
      }
    }
    
    console.warn("✗ No auth token found in localStorage")
    return null
  }

  const getUserId = () => {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem("authUser")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.id) {
          console.log(`✓ User ID found: ${user.id}`)
          return user.id
        }
      } catch (e) {
        console.error("✗ Failed to parse authUser:", e)
      }
    }
    
    console.warn("✗ No user ID found in localStorage")
    return null
  }

  // Fetch cart from backend - stable with empty dependency array
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = getAuthToken()
      const userStr = typeof window !== 'undefined' ? localStorage.getItem("authUser") : null
      
      // Parse user to check role
      let userRole = null
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          userRole = user.role
        } catch (e) {
          console.error("Failed to parse user:", e)
        }
      }

      //console.log("📋 Fetching cart... Token:", !!token, "Role:", userRole)

      // Skip cart fetch if:
      // 1. No token (not authenticated)
      // 2. User is a vendor (vendors don't have carts)
      if (!token || userRole === 'vendor') {
        //console.log("⏭️  Skipping cart fetch: not authenticated or is vendor")
        setCart(null)
        setLoading(false)
        return
      }

      const url = `${BACKEND_URL}/api/customer/cart`
      //console.log("🔗 Cart fetch URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${token}`,
        },
      })

      //console.log("Cart response status:", response.status)

      if (!response.ok) {
        // If 401, silently treat as not authenticated
        if (response.status === 401) {
          console.log("Cart fetch: 401 Unauthorized, clearing cart")
          setCart(null)
          setLoading(false)
          return
        }
        
        const errorText = await response.text()
        console.error("❌ Cart fetch error:", response.status, errorText)
        throw new Error(`Failed to fetch cart (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      //console.log("✓ Cart data received:", data)
      
      setCart(data.cart || null)
    } catch (err) {
      console.error("❌ Error fetching cart:", err)
      const message = err instanceof Error ? err.message : "Failed to fetch cart"
      setError(message)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array - stable function

  // Load cart on mount ONLY
  useEffect(() => {
    setMounted(true)
    fetchCart()
  }, [fetchCart])

  // Add item to cart
  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        setError(null)
        const token = getAuthToken()
        const userId = getUserId()

        if (!token || !userId) {
          setError("Not authenticated")
          return false
        }

        console.log("➕ Adding to cart:", { productId, quantity, userId })

        const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        })

        //console.log("📊 Add to cart response status:", response.status)

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to add item")
        }

        const data = await response.json()
        console.log("✓ Item added successfully")
        setCart(data.cart)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add item"
        setError(message)
        console.error("❌ Error adding to cart:", err)
        return false
      }
    },
    [] // Empty dependency array
  )

  // Remove item from cart
  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        setError(null)
        const token = getAuthToken()
        const userId = getUserId()

        if (!token || !userId) {
          setError("Not authenticated")
          return false
        }

        console.log("🗑️  Removing from cart:", productId)

        // Find the cart item to get its ID
        const cartItem = cart?.items.find((item) => {
          const id = typeof item.product === 'string' ? item.product : item.product.id
          return id === productId
        })

        if (!cartItem) {
          console.error("Item not found in cart")
          return false
        }

        // Get the item ID (try _id first, then id)
        const itemId = cartItem._id || cartItem.id
        if (!itemId) {
          console.error("Item ID not found")
          return false
        }

        // Use the correct endpoint: DELETE /api/cart/remove/[itemId]
        const response = await fetch(
          `${BACKEND_URL}/api/cart/remove/${itemId}?userId=${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `JWT ${token}`,
            },
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to remove item")
        }

        const data = await response.json()
        console.log("✓ Item removed successfully")
        setCart(data.cart)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove item"
        setError(message)
        console.error("❌ Error removing from cart:", err)
        return false
      }
    },
    [cart?.items] // Only depend on cart items
  )

  // Update quantity
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeFromCart(productId)
      }

      try {
        setError(null)
        const token = getAuthToken()
        const userId = getUserId()

        if (!token || !userId) {
          setError("Not authenticated")
          return false
        }

        console.log("📝 Updating quantity:", { productId, quantity })

        // To update quantity, we need to remove and re-add
        // First, remove the item
        const cartItem = cart?.items.find((item) => {
          const id = typeof item.product === 'string' ? item.product : item.product.id
          return id === productId
        })

        if (!cartItem) {
          console.error("Item not found in cart")
          return false
        }

        const itemId = cartItem._id || cartItem.id
        if (!itemId) {
          console.error("Item ID not found")
          return false
        }

        // Remove the item
        await fetch(
          `${BACKEND_URL}/api/cart/remove/${itemId}?userId=${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `JWT ${token}`,
            },
          }
        )

        // Add it back with new quantity
        const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "Failed to update quantity")
        }

        const data = await response.json()
        console.log("✓ Quantity updated successfully")
        setCart(data.cart)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update quantity"
        setError(message)
        console.error("❌ Error updating quantity:", err)
        return false
      }
    },
    [cart?.items, removeFromCart] // Depend on cart items and removeFromCart
  )

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setError(null)
      const token = getAuthToken()
      const userId = getUserId()

      if (!token || !userId) {
        setError("Not authenticated")
        return false
      }

      console.log("🧹 Clearing cart")

      const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${token}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to clear cart")
      }

      const data = await response.json()
      console.log("✓ Cart cleared successfully")
      setCart(data.cart || null)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear cart"
      setError(message)
      console.error("❌ Error clearing cart:", err)
      return false
    }
  }, []) // Empty dependency array

  return {
    cart,
    loading,
    error,
    mounted,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refetch: fetchCart,
  }
}