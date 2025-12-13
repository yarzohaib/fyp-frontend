'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/use-wishlist'
import type { WishlistButtonProps } from '@/lib/Types'

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
            className={`p-0 bg-transparent border-0 ring-0 shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200 ${inWishlist
                ? 'text-accent'
                : 'text-gray-700 hover:text-accent'
                } ${className}`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart className={`h-6 w-6 ${inWishlist ? 'fill-gray-700' : ''}`} />
            <span className="sr-only">{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
        </button>
    )
}