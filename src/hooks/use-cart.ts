'use client'

import { useState, useEffect } from 'react'

export interface CartItem {
    id: string | number
    name: string
    price: number
    image: string
    slug?: string
    quantity: number
    color?: string
    inStock: boolean
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            setCart(JSON.parse(saved))
        }
        setMounted(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart, mounted])

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart((prev) => {
            const exists = prev.find((c) => c.id === item.id && c.color === item.color)
            if (exists) {
                return prev.map((c) =>
                    c.id === item.id && c.color === item.color
                        ? { ...c, quantity: c.quantity + (item.quantity || 1) }
                        : c
                )
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }]
        })
    }

    const removeFromCart = (id: string | number, color?: string) => {
        setCart((prev) => prev.filter((c) => !(c.id === id && c.color === color)))
    }

    const updateQuantity = (id: string | number, quantity: number, color?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, color)
            return
        }
        setCart((prev) =>
            prev.map((c) =>
                c.id === id && c.color === color ? { ...c, quantity } : c
            )
        )
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const clearCart = () => {
        setCart([])
    }

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
    }
}
