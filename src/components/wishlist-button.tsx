'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/components/ui/toast'
import type { WishlistButtonProps } from '@/lib/Types'

export function WishlistButton({ item, className = '' }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist()
    const { showToast } = useToast()
    const inWishlist = isInWishlist(item.id)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(item)
                showToast(
                    inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
                    'wishlist'
                )
            }}
            className={`p-0 bg-transparent border-0 ring-0 shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200 ${
                inWishlist ? 'text-[#BB4E2C]' : 'text-gray-700 hover:text-[#BB4E2C]'
            } ${className}`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart className={`h-6 w-6 ${inWishlist ? 'fill-[#BB4E2C]' : ''}`} />
            <span className="sr-only">{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
        </button>
    )
}