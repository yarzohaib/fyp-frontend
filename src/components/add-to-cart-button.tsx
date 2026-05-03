'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBackendCart } from '@/hooks/use-backend-cart'
import { useToast } from '@/components/ui/toast'
import type { AddToCartButtonProps } from '@/lib/Types'

export function AddToCartButton({
    id,
    quantity,
    inStock,
    variant = 'default',
}: AddToCartButtonProps) {
    const { addToCart, loading } = useBackendCart()
    const { showToast } = useToast()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (inStock && id) {
            const success = await addToCart(String(id), quantity)
            if (success) {
                showToast('Added to Cart', 'cart')
            }
        }
    }

    if (variant === 'hover') {
        return (
            <Button
                onClick={handleAddToCart}
                disabled={!inStock || loading}
                className="w-full bg-[#BB4E2C] text-background hover:bg-[#BB4E2C]/90 rounded-none py-2 text-sm font-semibold flex items-center justify-center gap-2"
            >
                <ShoppingCart className="h-4 w-4" />
                {loading ? 'Loading...' : 'Add to Cart'}
            </Button>
        )
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className="flex-1 bg-[#BB4E2C]  text-background hover:bg-[#BB4E2C]/90 rounded-none py-6 text-base font-semibold flex items-center justify-center gap-2"
        >
            <ShoppingCart className="h-5 w-5" />
            {loading ? 'Loading...' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
    )
}
