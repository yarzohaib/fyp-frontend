"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Store } from "lucide-react"
import { useBackendCart } from "@/hooks/use-backend-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"

interface ProductColor {
    color?: string
    id?: string
}

interface ProductDetailsProps {
    product: {
        id: string
        title: string
        price: number
        discountedPrice?: number
        shortDescription?: string
        Description?: string
        inStock: boolean
        colors?: ProductColor[]
        category?: string
        vendor?: { id: string; storeName: string; slug: string } | null
    }
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const colorOptions = product.colors || []
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.color || "")
    const [quantity, setQuantity] = useState(1)
    const { addToCart, loading, error } = useBackendCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const { showToast } = useToast()
    
    const inWishlist = isInWishlist(product.id)

    const handleAddToCart = async () => {
        console.log("Adding to cart:", {
            productId: product.id,
            quantity,
            color: selectedColor,
        })
        
        const success = await addToCart(product.id, quantity)
        if (success) {
            showToast('Added to Cart', 'cart')
            setQuantity(1)
        }
    }

    const handleToggleWishlist = () => {
        toggleWishlist({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.shortDescription || '',
            inStock: product.inStock,
        })
        showToast(inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist', 'wishlist')
    }

    return (
        <div className="space-y-4">
            {/* Category + Vendor row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                {product.category && (
                    <p className="text-sm text-foreground/60 tracking-wide uppercase">
                        {product.category}
                    </p>
                )}
                {product.vendor && (
                    <Link
                        href={`/store/${product.vendor.id}`}
                        className="inline-flex items-center gap-1.5 text-sm text-[#1A3126] hover:text-[#BB4E2C] font-medium transition-colors"
                    >
                        <Store className="h-3.5 w-3.5" />
                        {product.vendor.storeName}
                    </Link>
                )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {product.title}
            </h1>

            {/* shortDescription or Description */}
            <p className="text-foreground/70 leading-relaxed text-base">
                {product.shortDescription || product.Description || 'No description available'}
            </p>

            {/* Colors */}
            {colorOptions.length > 0 && (
                <div className="pt-2">
                    <label className="block text-sm font-medium text-foreground mb-3">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((colorObj) => (
                            <button
                                key={colorObj.id}
                                onClick={() => setSelectedColor(colorObj.color || "")}
                                className={`px-4 py-2 rounded-lg border-2 transition-all capitalize text-sm ${
                                    selectedColor === colorObj.color
                                        ? "border-foreground bg-foreground text-background font-medium"
                                        : "border-border bg-background text-foreground hover:border-foreground/50"
                                }`}
                            >
                                {colorObj.color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 pt-2">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center border-2 border-border rounded-lg">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-foreground hover:bg-foreground/5 font-medium transition-colors"
                        disabled={loading}
                    >
                        −
                    </button>
                    <span className="px-6 py-2 text-foreground font-medium min-w-15 text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-foreground hover:bg-foreground/5 font-medium transition-colors"
                        disabled={loading}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-4 flex-wrap">
                <span className="text-3xl font-bold text-foreground">
                    Rs. {(product.discountedPrice ?? product.price).toLocaleString()}
                </span>
                {product.discountedPrice && (
                    <>
                        <span className="text-lg text-foreground/40 line-through">
                            Rs. {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-[#1A3126] bg-[#1A3126]/10 px-2 py-0.5 rounded">
                            {Math.round((1 - product.discountedPrice / product.price) * 100)}% off
                        </span>
                    </>
                )}
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || loading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg py-6 text-base font-semibold flex items-center justify-center gap-2 transition-all"
            >
                <ShoppingCart className="h-5 w-5" />
                {loading ? 'Loading...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Save to Wishlist */}
            <button
                onClick={handleToggleWishlist}
                className="w-full flex items-center justify-center gap-2 py-3 text-foreground hover:text-foreground/80 transition-colors text-sm font-medium"
            >
                <Heart
                    className={`h-5 w-5 transition-all ${inWishlist ? 'fill-[#BB4E2C] text-[#BB4E2C]' : ''}`}
                />
                {inWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}

            {/* Stock Status */}
            {!product.inStock && (
                <p className="text-sm text-red-600 font-medium text-center">
                    This item is currently out of stock
                </p>
            )}
        </div>
    )
}


