// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import type { ProductCardProps } from "@/components/product-card"

// interface FeaturedCarouselProps {
//     products: ProductCardProps[]
// }

// export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
//     const [currentIndex, setCurrentIndex] = useState(0)

//     const cardsPerView = {
//         sm: 1,
//         md: 2,
//         lg: 3,
//     }

//     const handlePrevious = () => {
//         setCurrentIndex((prev) => Math.max(0, prev - 1))
//     }

//     const handleNext = () => {
//         const maxIndex = Math.max(0, products.length - cardsPerView.lg)
//         setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
//     }

//     if (!products || products.length === 0) return null

//     return (
//         <section className="mb-16">
//             <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">Featured Products</h2>

//             <div className="relative">
//                 {/* Carousel Container */}
//                 <div className="overflow-hidden">
//                     <div
//                         className="flex transition-transform duration-500 ease-out"
//                         style={{
//                             transform: `translateX(-${currentIndex * (100 / cardsPerView.lg)}%)`,
//                         }}
//                     >
//                         {products.map((product) => (
//                             <div
//                                 key={product.id}
//                                 className="flex-shrink-0 px-2
//                   w-full sm:w-1/2 md:w-1/2 lg:w-1/3"
//                             >
//                                 <Link href={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}>
//                                     <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 h-full">
//                                         <CardContent className="p-0">
//                                             <div className="relative aspect-square overflow-hidden bg-secondary/20">
//                                                 <Image
//                                                     src={product.image || "/placeholder.svg"}
//                                                     alt={product.name}
//                                                     fill
//                                                     className="object-cover"
//                                                 />
//                                             </div>
//                                             <div className="p-4">
//                                                 <h3 className="text-lg font-semibold text-foreground mb-2 text-balance">{product.name}</h3>
//                                                 <p className="text-lg font-bold text-accent">${product.price}</p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </Link>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 {currentIndex > 0 && (
//                     <button
//                         onClick={handlePrevious}
//                         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
//                         aria-label="Previous product"
//                     >
//                         <ChevronLeft className="h-6 w-6" />
//                     </button>
//                 )}

//                 {currentIndex < Math.max(0, products.length - cardsPerView.lg) && (
//                     <button
//                         onClick={handleNext}
//                         className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
//                         aria-label="Next product"
//                     >
//                         <ChevronRight className="h-6 w-6" />
//                     </button>
//                 )}

//                 {/* Indicators */}
//                 <div className="flex justify-center gap-2 mt-6">
//                     {Array.from({ length: Math.max(0, products.length - cardsPerView.lg + 1) }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setCurrentIndex(index)}
//                             className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-accent w-8" : "bg-border w-2"
//                                 }`}
//                             aria-label={`Go to product ${index + 1}`}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }


"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"

interface CarouselProduct {
    id: string
    name: string
    price: number
    image: string
    slug?: string
}

export function FeaturedCarousel() {
    const [products, setProducts] = useState<CarouselProduct[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

            try {
                const response = await fetch(`${baseUrl}/api/products?limit=12`, {
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch products (${response.status})`)
                }

                const data = await response.json()
                const normalized: CarouselProduct[] =
                    data.docs?.map((product: Product) => ({
                        id: product.id,
                        name: product.title,
                        price: product.pricing?.price ?? 0,
                        image: buildImageUrl(product.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
                        slug: product.slug,
                    })) ?? []

                setProducts(normalized.slice(0, 6))
            } catch (error) {
                console.error("Failed to fetch products for carousel:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const cardsPerView = { sm: 1, md: 2, lg: 3 }

    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        const maxIndex = Math.max(0, products.length - cardsPerView.lg)
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    }

    if (loading) {
        return (
            <section className="mb-16">
                <div className="h-64 bg-secondary/20 rounded-lg animate-pulse"></div>
            </section>
        )
    }

    if (!products || products.length === 0) return null

    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-balance">Featured Products</h2>

            <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / cardsPerView.lg)}%)`,
                        }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="flex-shrink-0 px-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                                <Link href={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}>
                                    <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 h-full">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square overflow-hidden bg-secondary/20">
                                                <Image
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-foreground mb-2 text-balance line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-lg font-bold text-accent">
                                                    Rs {product.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                        aria-label="Previous product"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {currentIndex < Math.max(0, products.length - cardsPerView.lg) && (
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                        aria-label="Next product"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: Math.max(0, products.length - cardsPerView.lg + 1) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-accent w-8" : "bg-border w-2"
                                }`}
                            aria-label={`Go to product ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
