import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "./add-to-cart-button"
import { WishlistButton } from "./wishlist-button"
import { buildImageUrl } from "@/lib/utils"
import type { ProductCardProps } from "@/lib/Types"

export type { ProductCardProps }

function calculateInStock(inStock?: boolean, inventory?: { quantity: number }): boolean {
    if (inStock !== undefined) return inStock
    return (inventory?.quantity ?? 0) > 0
}

export function ProductCard({
    id,
    title,
    price,
    image,
    inStock,
    inventory,
    onSale = false,
    slug,
}: ProductCardProps) {
    const href = slug ? `/products/${slug}` : `/products/${id}`
    const displayImage = buildImageUrl(image) ?? "/placeholder.svg"
    const isInStock = calculateInStock(inStock, inventory)

    return (
        <Link href={href}>
            <Card className="group overflow-hidden border-0 rounded-xl transition-shadow duration-300">
                <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-secondary/20">
                        <Image
                            src={displayImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            <div className="space-y-2">
                                {!isInStock && (
                                    <Badge
                                        className="text-[#F2F0E5]"
                                        style={{ backgroundColor: '#BB4E2C' }}
                                    >
                                        Out of Stock
                                    </Badge>
                                )}
                                {onSale && isInStock && (
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                        Sale
                                    </Badge>
                                )}
                            </div>
                            <WishlistButton
                                item={{ id, title, price, image: displayImage, slug, inStock: isInStock }}
                            />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3  pt-6">
                            <AddToCartButton
                                id={id}
                                title={title}
                                price={price}
                                image={displayImage}
                                slug={slug}
                                quantity={1}
                                inStock={isInStock}
                                variant="hover"
                            />
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-foreground mb-1 text-balance">{title}</h3>
                        <p className="text-sm font-semibold text-accent">Rs. {price}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
