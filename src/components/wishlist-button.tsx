'use client'

import { Heart } from 'lucide-react'
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist'

interface WishlistButtonProps {
    item: WishlistItem
    className?: string
}

export function WishlistButton({ item, className = '' }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const inWishlist = isInWishlist(item.id)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(item)
            }}
            className={`p-2 rounded-full transition-all duration-200 ${inWishlist
                ? 'bg-accent text-background'
                : 'bg-background/80 text-foreground hover:bg-accent hover:text-background'
                } ${className}`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500' : ''}`} />
            <span className="sr-only">{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
        </button>
    )
}
