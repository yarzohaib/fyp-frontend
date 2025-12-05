'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBackendCart } from '@/hooks/use-backend-cart'
import type { AddToCartButtonProps } from '@/lib/Types'

export function AddToCartButton({
    id,
    title,
    price,
    image,
    slug,
    quantity,
    color,
    inStock,
    variant = 'default',
}: AddToCartButtonProps) {
    const { addToCart, loading } = useBackendCart()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (inStock && id) {
            const success = await addToCart(String(id), quantity)
            if (success) {
                console.log('Item added to cart successfully')
            }
        }
    }

    if (variant === 'hover') {
        return (
            <Button
                onClick={handleAddToCart}
                disabled={!inStock || loading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-2 text-sm font-semibold flex items-center justify-center gap-2"
            >
                <ShoppingCart className="h-4 w-4" />
                {loading ? 'Adding...' : 'Add to Cart'}
            </Button>
        )
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
        >
            <ShoppingCart className="h-5 w-5" />
            {loading ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
    )
}
