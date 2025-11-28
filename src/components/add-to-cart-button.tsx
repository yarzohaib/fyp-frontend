'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

interface AddToCartButtonProps {
    id: string | number
    name: string
    price: number
    image: string
    slug?: string
    quantity: number
    color?: string
    inStock: boolean
    variant?: 'default' | 'hover'
}

export function AddToCartButton({
    id,
    name,
    price,
    image,
    slug,
    quantity,
    color,
    inStock,
    variant = 'default',
}: AddToCartButtonProps) {
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (inStock) {
            addToCart({
                id,
                name,
                price,
                image,
                slug,
                quantity,
                color,
                inStock,
            })
        }
    }

    if (variant === 'hover') {
        return (
            <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-2 text-sm font-semibold flex items-center justify-center gap-2"
            >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
            </Button>
        )
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
        >
            <ShoppingCart className="h-5 w-5" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
    )
}
