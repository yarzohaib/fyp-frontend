'use client'

/**
 * Backward-compatible shim — existing components that import useBackendCart
 * continue to work without modification, but now share a single cart instance
 * via CartContext instead of each making independent network requests.
 */
export { useCart as useBackendCart } from '@/contexts/cart-context'
export type { Cart, CartItem } from '@/contexts/cart-context'

