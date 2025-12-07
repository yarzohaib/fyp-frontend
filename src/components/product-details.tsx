// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { ShoppingCart } from "lucide-react"
// import { useBackendCart } from "@/hooks/use-backend-cart"

// interface ProductColor {
//     color?: string
//     id?: string
// }

// interface ProductDetailsProps {
//     product: {
//         id: string
//         title: string
//         price: number
//         comparePrice?: number
//         description: string
//         inStock: boolean
//         colors?: ProductColor[]
//     }
// }

// export function ProductDetails({ product }: ProductDetailsProps) {
//     const colorOptions = product.colors || []
//     const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.color || "")
//     const [quantity, setQuantity] = useState(1)
//     const { addToCart, loading, error } = useBackendCart()

//     const handleAddToCart = async () => {
//         console.log("Adding to cart:", {
//             productId: product.id,
//             quantity,
//             color: selectedColor,
//         })
        
//         const success = await addToCart(product.id, quantity)
//         if (success) {
//             console.log("✓ Item added to cart successfully")
//             // Optional: Reset quantity after successful add
//             setQuantity(1)
//         }
//     }

//     return (
//         <div className="space-y-6">
//             {/* Title and Price */}
//             <div>
//                 <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
//                 <div className="flex items-center gap-3">
//                     <span className="text-2xl font-bold text-accent">Rs. {product.price}</span>
//                     {product.comparePrice && (
//                         <span className="text-lg text-foreground/50 line-through">Rs. {product.comparePrice}</span>
//                     )}
//                 </div>
//             </div>

//             {/* Description */}
//             <p className="text-foreground/70 leading-relaxed">{product.description}</p>

//             {/* Colors */}
//             {colorOptions.length > 0 && (
//                 <div>
//                     <label className="block text-sm font-medium text-foreground mb-3">Color</label>
//                     <div className="flex flex-wrap gap-3">
//                         {colorOptions.map((colorObj) => (
//                             <button
//                                 key={colorObj.id}
//                                 onClick={() => setSelectedColor(colorObj.color || "")}
//                                 className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
//                                     selectedColor === colorObj.color
//                                         ? "border-accent bg-accent text-background font-medium"
//                                         : "border-border bg-background text-foreground hover:border-accent"
//                                 }`}
//                             >
//                                 {colorObj.color}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Quantity and Add to Cart */}
//             <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                     <label className="text-sm font-medium text-foreground">Quantity</label>
//                     <div className="flex items-center border border-border rounded-lg">
//                         <button
//                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                             className="px-3 py-2 text-foreground hover:bg-secondary/20"
//                             disabled={loading}
//                         >
//                             −
//                         </button>
//                         <span className="px-4 py-2 text-foreground">{quantity}</span>
//                         <button
//                             onClick={() => setQuantity(quantity + 1)}
//                             className="px-3 py-2 text-foreground hover:bg-secondary/20"
//                             disabled={loading}
//                         >
//                             +
//                         </button>
//                     </div>
//                 </div>

//                 <Button
//                     onClick={handleAddToCart}
//                     disabled={!product.inStock || loading}
//                     className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
//                 >
//                     <ShoppingCart className="h-5 w-5" />
//                     {loading ? 'Loading...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
//                 </Button>

//                 {error && (
//                     <p className="text-sm text-accent font-medium">{error}</p>
//                 )}
//             </div>

//             {/* Stock Status */}
//             {!product.inStock && <p className="text-sm text-accent font-medium">This item is currently out of stock</p>}
//         </div>
//     )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useBackendCart } from "@/hooks/use-backend-cart"

interface ProductColor {
    color?: string
    id?: string
}

interface ProductDetailsProps {
    product: {
        id: string
        title: string
        price: number
        comparePrice?: number
        shortDescription: string
        inStock: boolean
        colors?: ProductColor[]
        category?: string 
    }
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const colorOptions = product.colors || []
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.color || "")
    const [quantity, setQuantity] = useState(1)
    const [isSaved, setIsSaved] = useState(false)
    const { addToCart, loading, error } = useBackendCart()

    const handleAddToCart = async () => {
        console.log("Adding to cart:", {
            productId: product.id,
            quantity,
            color: selectedColor,
        })
        
        const success = await addToCart(product.id, quantity)
        if (success) {
            console.log("✓ Item added to cart successfully")
            setQuantity(1)
        }
    }

    const handleSaveToWishlist = () => {
        setIsSaved(!isSaved)
        console.log(isSaved ? "Removed from wishlist" : "Saved to wishlist")
        // Implement your wishlist logic here
    }

    return (
        <div className="space-y-4">
            {/* Category */}
            {product.category && (
                <p className="text-sm text-foreground/60 tracking-wide uppercase">
                    {product.category}
                </p>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {product.title}
            </h1>

            {/* shortDescription */}
            <p className="text-foreground/70 leading-relaxed text-base">
                {product.shortDescription}
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
                    <span className="px-6 py-2 text-foreground font-medium min-w-[60px] text-center">
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
            <div className="flex items-baseline gap-3 pt-4">
                <span className="text-3xl font-bold text-foreground">
                    Rs. {product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                    <span className="text-lg text-foreground/40 line-through">
                        Rs. {product.comparePrice.toLocaleString()}
                    </span>
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
                onClick={handleSaveToWishlist}
                className="w-full flex items-center justify-center gap-2 py-3 text-foreground hover:text-foreground/80 transition-colors text-sm font-medium"
            >
                <Heart 
                    className={`h-5 w-5 transition-all ${isSaved ? 'fill-foreground' : ''}`}
                />
                {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
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


