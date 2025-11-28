// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { ShoppingCart } from "lucide-react"

// interface ProductDetailsProps {
//     product: {
//         id: string
//         title: string
//         price: number
//         comparePrice?: number
//         description: string
//         inStock: boolean
//         colors?: Array<{
//             name: string
//             hex: string
//         }>
//     }
// }

// export function ProductDetails({ product }: ProductDetailsProps) {
//     const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "")
//     const [quantity, setQuantity] = useState(1)

//     const handleAddToCart = () => {
//         console.log("Added to cart:", {
//             productId: product.id,
//             quantity,
//             color: selectedColor,
//         })
//         // TODO: Implement cart functionality
//     }

//     return (
//         <div className="space-y-6">
//             {/* Title and Price */}
//             <div>
//                 <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
//                 <div className="flex items-center gap-3">
//                     <span className="text-2xl font-bold text-accent">${product.price}</span>
//                     {product.comparePrice && (
//                         <span className="text-lg text-foreground/50 line-through">${product.comparePrice}</span>
//                     )}
//                 </div>
//             </div>

//             {/* Description */}
//             <p className="text-foreground/70 leading-relaxed">{product.description}</p>

//             {/* Colors */}
//             {product.colors && product.colors.length > 0 && (
//                 <div>
//                     <label className="block text-sm font-medium text-foreground mb-3">Color</label>
//                     <div className="flex gap-3">
//                         {product.colors.map((color) => (
//                             <button
//                                 key={color.name}
//                                 onClick={() => setSelectedColor(color.name)}
//                                 className={`relative h-10 w-10 rounded-full border-2 transition-all ${selectedColor === color.name ? "border-foreground ring-2 ring-accent" : "border-border"
//                                     }`}
//                                 style={{ backgroundColor: color.hex }}
//                                 title={color.name}
//                             >
//                                 {selectedColor === color.name && (
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <div className="h-2 w-2 rounded-full bg-foreground" />
//                                     </div>
//                                 )}
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
//                         >
//                             −
//                         </button>
//                         <span className="px-4 py-2 text-foreground">{quantity}</span>
//                         <button
//                             onClick={() => setQuantity(quantity + 1)}
//                             className="px-3 py-2 text-foreground hover:bg-secondary/20"
//                         >
//                             +
//                         </button>
//                     </div>
//                 </div>

//                 <Button
//                     onClick={handleAddToCart}
//                     disabled={!product.inStock}
//                     className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
//                 >
//                     <ShoppingCart className="h-5 w-5" />
//                     {product.inStock ? "Add to Cart" : "Out of Stock"}
//                 </Button>
//             </div>

//             {/* Stock Status */}
//             {!product.inStock && <p className="text-sm text-accent font-medium">This item is currently out of stock</p>}
//         </div>
//     )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { useWishlist } from "@/hooks/use-wishlist"
import { AddToCartButton } from "./add-to-cart-button"

const COLOR_ALIASES: Record<string, string> = {
    golden: "#d4af37",
    gold: "#ffd700",
    silver: "#c0c0c0",
    bronze: "#cd7f32",
    beige: "#f5f5dc",
    ivory: "#fffff0",
}

function resolveSwatchColor(value?: string | null) {
    if (!value) return undefined

    const trimmed = value.trim()
    if (!trimmed) return undefined

    const lower = trimmed.toLowerCase()

    if (typeof window !== "undefined" && window.CSS?.supports?.("color", trimmed)) {
        return trimmed
    }

    if (typeof window !== "undefined" && window.CSS?.supports?.("color", lower)) {
        return lower
    }

    return COLOR_ALIASES[lower]
}


type ProductColor =
    | string
    | {
        id?: string
        name?: string
        hex?: string
        color?: string
        value?: string
    }

interface ProductDetailsProps {
    product: {
        id: string
        title: string
        price: number
        comparePrice?: number
        description: string
        inStock: boolean
        colors?: ProductColor[]
        image?: string
        slug?: string
    }
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const colorOptions =
        product.colors?.map((color, index) => {
            if (typeof color === "string") {
                const label = color.trim() || `Color ${index + 1}`
                return {
                    id: `${label}-${index}`,
                    label,
                    swatch: resolveSwatchColor(label),
                }
            }

            const rawLabel = color.name || color.color || color.value || color.hex || ""
            const label = rawLabel.trim() || `Color ${index + 1}`

            return {
                id: color.id || `${label}-${index}`,
                label,
                swatch: resolveSwatchColor(color.hex || rawLabel),
            }
        }) ?? []

    const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.label || "")
    const [quantity, setQuantity] = useState(1)
    const { isInWishlist, toggleWishlist } = useWishlist()
    const inWishlist = isInWishlist(product.id)


    const handleWishlist = () => {
        toggleWishlist({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.image || "/placeholder.svg",
            slug: product.slug,
        })
    }

    return (
        <div className="space-y-6">
            {/* Title and Price */}
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-accent">${product.price}</span>
                    {product.comparePrice && (
                        <span className="text-lg text-foreground/50 line-through">${product.comparePrice}</span>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {colorOptions.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Color</label>
                    <div className="flex gap-4">
                        {colorOptions.map((color) => (
                            <div key={color.id} className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => setSelectedColor(color.label)}
                                    className={`relative h-10 w-10 rounded-full border-2 transition-all ${selectedColor === color.label ? "border-foreground ring-2 ring-accent" : "border-border"
                                        }`}
                                    style={{ backgroundColor: color.swatch || "#d1d5db" }}
                                    title={color.label}
                                >
                                    {selectedColor === color.label && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-foreground" />
                                        </div>
                                    )}
                                </button>
                                <span className="text-xs text-foreground capitalize">{color.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity and Buttons */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-foreground">Quantity</label>
                    <div className="flex items-center border border-border rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 text-foreground hover:bg-secondary/20"
                        >
                            −
                        </button>
                        <span className="px-4 py-2 text-foreground">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 text-foreground hover:bg-secondary/20"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <AddToCartButton
                        id={product.id}
                        name={product.title}
                        price={product.price}
                        image={product.image || "/placeholder.svg"}
                        slug={product.slug}
                        quantity={quantity}
                        color={selectedColor}
                        inStock={product.inStock}
                    />

                    <Button
                        onClick={handleWishlist}
                        variant="outline"
                        className={`px-6 rounded-full py-6 transition-all ${inWishlist
                            ? 'bg-accent text-background border-accent'
                            : 'border-border text-foreground hover:border-accent hover:bg-accent hover:text-background'
                            }`}
                    >
                        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                        <span className="sr-only">{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
                    </Button>
                </div>
            </div>

            {/* Stock Status */}
            {!product.inStock && <p className="text-sm text-accent font-medium">This item is currently out of stock</p>}
        </div>
    )
}
