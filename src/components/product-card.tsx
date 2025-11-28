// // import Image from "next/image"
// // import Link from "next/link"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"

// // export interface ProductCardProps {
// //     id: string | number
// //     name: string
// //     price: number
// //     image: string
// //     inStock: boolean
// //     category?: string
// //     shortDescription?: string
// //     comparePrice?: number
// //     slug?: string
// // }

// // export function ProductCard({
// //     id,
// //     name,
// //     price,
// //     image,
// //     inStock = true,
// //     category,
// //     shortDescription,
// //     comparePrice,
// //     slug
// // }: ProductCardProps) {
// //     // Determine if product is on sale
// //     const onSale = comparePrice && comparePrice > price;

// //     // Use slug if available, otherwise fall back to id
// //     const productUrl = slug ? `/products/${slug}` : `/products/${id}`;

// //     return (
// //         <Link href={productUrl}>
// //             <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
// //                 <CardContent className="p-0">
// //                     <div className="relative aspect-square overflow-hidden bg-secondary/20">
// //                         <Image
// //                             src={image || "/placeholder.svg"}
// //                             alt={name}
// //                             fill
// //                             className="object-cover group-hover:scale-105 transition-transform duration-300"
// //                         />
// //                         {!inStock && (
// //                             <Badge
// //                                 variant="destructive"
// //                                 className="absolute top-3 right-3 bg-destructive text-destructive-foreground"
// //                             >
// //                                 Out of Stock
// //                             </Badge>
// //                         )}
// //                         {onSale && inStock && (
// //                             <Badge variant="secondary" className="absolute top-3 right-3 bg-accent text-accent-foreground">
// //                                 Sale
// //                             </Badge>
// //                         )}
// //                     </div>
// //                     <div className="p-4">
// //                         <h3 className="text-sm font-medium text-foreground mb-1 text-balance">{name}</h3>
// //                         {shortDescription && (
// //                             <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{shortDescription}</p>
// //                         )}
// //                         <div className="flex items-center gap-2">
// //                             <p className="text-sm font-semibold text-destructive">Rs. {price.toLocaleString()}</p>
// //                             {comparePrice && comparePrice > price && (
// //                                 <p className="text-xs text-muted-foreground line-through">
// //                                     Rs. {comparePrice.toLocaleString()}
// //                                 </p>
// //                             )}
// //                         </div>
// //                         {category && (
// //                             <p className="text-xs text-muted-foreground mt-1">{category}</p>
// //                         )}
// //                     </div>
// //                 </CardContent>
// //             </Card>
// //         </Link>
// //     )
// // }


// import Image from "next/image"
// import Link from "next/link"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// export interface ProductCardProps {
//     id: string | number
//     name: string
//     price: number
//     image: string
//     inStock: boolean
//     category?: string
//     shortDescription?: string
//     comparePrice?: number
//     slug?: string
// }

// export function ProductCard({
//     id,
//     name,
//     price,
//     image,
//     inStock = true,
//     category,
//     shortDescription,
//     comparePrice,
//     slug
// }: ProductCardProps) {
//     // Determine if product is on sale
//     const onSale = comparePrice && comparePrice > price;

//     // Use slug if available, otherwise fall back to id
//     const productUrl = slug ? `/products/${slug}` : `/products/${id}`;

//     return (
//         <Link href={productUrl} className="h-full">
//             <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
//                 <CardContent className="p-0">
//                     <div className="relative aspect-square overflow-hidden bg-secondary/20">
//                         <Image
//                             src={image || "/placeholder.svg"}
//                             alt={name}
//                             fill
//                             className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                         {!inStock && (
//                             <Badge
//                                 variant="destructive"
//                                 className="absolute top-3 right-3 bg-destructive text-destructive-foreground"
//                             >
//                                 Out of Stock
//                             </Badge>
//                         )}
//                         {onSale && inStock && (
//                             <Badge variant="secondary" className="absolute top-3 right-3 bg-accent text-accent-foreground">
//                                 Sale
//                             </Badge>
//                         )}
//                     </div>
//                     <div className="p-4">
//                         <h3 className="text-sm font-medium text-foreground mb-1 text-balance">{name}</h3>
//                         {shortDescription && (
//                             <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{shortDescription}</p>
//                         )}
//                         <div className="flex items-center gap-2">
//                             <p className="text-sm font-semibold text-destructive">Rs. {price.toLocaleString()}</p>
//                             {comparePrice && comparePrice > price && (
//                                 <p className="text-xs text-muted-foreground line-through">
//                                     Rs. {comparePrice.toLocaleString()}
//                                 </p>
//                             )}
//                         </div>
//                         {category && (
//                             <p className="text-xs text-muted-foreground mt-1">{category}</p>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>
//         </Link>
//     )
// }

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
//import { WishlistButton } from "@/components/wishlist-button"
import { AddToCartButton } from "./add-to-cart-button"
import { WishlistButton } from "./wishlist-button"
import { buildImageUrl } from "@/lib/utils"

export interface ProductCardProps {
    id: string | number
    name: string
    price: number
    image: string
    inStock?: boolean
    onSale?: boolean
    slug?: string
}

export function ProductCard({
    id,
    name,
    price,
    image,
    inStock = true,
    onSale = false,
    slug,
}: ProductCardProps) {
    const href = slug ? `/products/${slug}` : `/products/${id}`
    const displayImage = buildImageUrl(image) ?? "/placeholder.svg"

    return (
        <Link href={href}>
            <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-secondary/20">
                        <Image
                            src={displayImage}
                            alt={name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            <div className="space-y-2">
                                {!inStock && (
                                    <Badge
                                        variant="destructive"
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        Out of Stock
                                    </Badge>
                                )}
                                {onSale && inStock && (
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                        Sale
                                    </Badge>
                                )}
                            </div>
                            <WishlistButton
                                item={{ id, name, price, image: displayImage, slug }}
                            />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 bg-gradient-to-t from-background/95 to-transparent pt-6">
                            <AddToCartButton
                                id={id}
                                name={name}
                                price={price}
                                image={displayImage}
                                slug={slug}
                                quantity={1}
                                inStock={inStock}
                                variant="hover"
                            />
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-medium text-foreground mb-1 text-balance">{name}</h3>
                        <p className="text-sm font-semibold text-accent">${price}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
