"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

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
        description: string
        inStock: boolean
        colors?: ProductColor[]
    }
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const colorOptions = product.colors || []
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.color || "")
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        console.log("Added to cart:", {
            productId: product.id,
            quantity,
            color: selectedColor,
        })
        // TODO: Implement cart functionality
    }

    return (
        <div className="space-y-6">
            {/* Title and Price */}
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-accent">Rs. {product.price}</span>
                    {product.comparePrice && (
                        <span className="text-lg text-foreground/50 line-through">Rs. {product.comparePrice}</span>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {colorOptions.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Color</label>
                    <div className="flex flex-wrap gap-3">
                        {colorOptions.map((colorObj) => (
                            <button
                                key={colorObj.id}
                                onClick={() => setSelectedColor(colorObj.color || "")}
                                className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                                    selectedColor === colorObj.color
                                        ? "border-accent bg-accent text-background font-medium"
                                        : "border-border bg-background text-foreground hover:border-accent"
                                }`}
                            >
                                {colorObj.color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity and Add to Cart */}
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

                <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
            </div>

            {/* Stock Status */}
            {!product.inStock && <p className="text-sm text-accent font-medium">This item is currently out of stock</p>}
        </div>
    )
}