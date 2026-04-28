// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CarouselProduct } from "@/lib/Types"

// interface FeaturedCarouselProps {
//     products: CarouselProduct[]
// }

// function calculateInStock(inStock?: boolean, inventory?: { quantity: number }): boolean {
//     if (inStock !== undefined) return inStock
//     return (inventory?.quantity ?? 0) > 0
// }

// export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const [maxIndex, setMaxIndex] = useState(0)

//     const cardsPerView = { sm: 1, md: 2, lg: 4, xl: 5 }

//     const getCardsPerView = () => {
//         if (typeof window === 'undefined') return cardsPerView.lg
//         if (window.innerWidth >= 1280) return cardsPerView.xl
//         if (window.innerWidth >= 1024) return cardsPerView.lg
//         if (window.innerWidth >= 768) return cardsPerView.md
//         return cardsPerView.sm
//     }

//     const getTranslatePercentage = () => {
//         return 100 / getCardsPerView()
//     }

//     useEffect(() => {
//         const updateMaxIndex = () => {
//             const cards = getCardsPerView()
//             setMaxIndex(Math.max(0, products.length - cards))
//         }

//         updateMaxIndex()
//         window.addEventListener('resize', updateMaxIndex)
//         return () => window.removeEventListener('resize', updateMaxIndex)
//     }, [products.length])

//     const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
//     const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))

//     if (!products || products.length === 0) return null

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-foreground mb-8">
//                 Featured Products
//             </h2>

//             <div className="relative">
//                 {/* Container */}
//                 <div className="overflow-hidden">
//                     <div
//                         className="flex transition-transform duration-500 ease-out"
//                         style={{
//                             transform: `translateX(-${currentIndex * getTranslatePercentage()}%)`,
//                         }}
//                     >
//                         {products.map((product) => {
//                             const isInStock = calculateInStock(product.inStock, product.inventory)
                            
//                             return (
//                                 <div
//                                     key={product.id}
//                                     className="shrink-0 px-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/5"
//                                 >
//                                     <Link
//                                         href={`/products/${product.slug || product.id}`}
//                                         className="block"
//                                     >
//                                         <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-0 rounded-xl group">
//                                             <CardContent className="p-0">
//                                                 <div className="relative aspect-square bg-gray-100 overflow-hidden">
//                                                     <Image
//                                                         src={product.image}
//                                                         alt={product.name}
//                                                         fill
//                                                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                                                     />
//                                                     {!isInStock && (
//                                                         <div className="absolute top-3 left-3">
//                                                             <Badge
//                                                                 className="text-[#F2F0E5]"
//                                                                 style={{ backgroundColor: '#BB4E2C' }}
//                                                             >
//                                                                 Out of Stock
//                                                             </Badge>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <div className="p-4">
//                                                     <h3 className="text-base font-semibold mb-2 line-clamp-2 min-h-12">
//                                                         {product.name}
//                                                     </h3>
//                                                     <p className="text-lg font-bold text-[#1a3126]">
//                                                         Rs. {product.price.toLocaleString()}
//                                                     </p>
//                                                 </div>
//                                             </CardContent>
//                                         </Card>
//                                     </Link>
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 {currentIndex > 0 && (
//                     <button
//                         onClick={handlePrevious}
//                         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 p-2 sm:p-3 rounded-full bg-[#1a3126] text-white shadow-lg hover:bg-[#0f1f16] transition-colors"
//                         aria-label="Previous products"
//                     >
//                         <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                 )}

//                 {currentIndex < maxIndex && (
//                     <button
//                         onClick={handleNext}
//                         className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 p-2 sm:p-3 rounded-full bg-[#1a3126] text-white shadow-lg hover:bg-[#0f1f16] transition-colors"
//                         aria-label="Next products"
//                     >
//                         <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                 )}

//                 {/* Indicators */}
//                 <div className="flex justify-center gap-2 mt-6">
//                     {Array.from({ length: maxIndex + 1 }).map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => setCurrentIndex(i)}
//                             className={`h-2 rounded-full transition-all ${
//                                 i === currentIndex 
//                                     ? "bg-[#1a3126] w-8" 
//                                     : "bg-gray-300 w-2 hover:bg-gray-400"
//                             }`}
//                             aria-label={`Go to slide ${i + 1}`}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CarouselProduct } from "@/lib/Types"

interface FeaturedCarouselProps {
    products: CarouselProduct[]
}

function calculateInStock(inStock?: boolean, inventory?: { quantity: number }): boolean {
    if (inStock !== undefined) return inStock
    return (inventory?.quantity ?? 0) > 0
}

function getCardsPerView(width: number): number {
    if (width >= 1280) return 5
    if (width >= 1024) return 4
    if (width >= 768) return 2
    return 1
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    // Start with a fixed SSR-safe value — updated after mount
    const [cardsPerView, setCardsPerView] = useState(4)
    const [mounted, setMounted] = useState(false)

    const maxIndex = Math.max(0, products.length - cardsPerView)

    useEffect(() => {
        setMounted(true)

        const update = () => {
            const next = getCardsPerView(window.innerWidth)
            setCardsPerView(next)
            // Clamp index so we don't go out of range after resize
            setCurrentIndex((prev) => Math.min(prev, Math.max(0, products.length - next)))
        }

        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [products.length])

    const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
    const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))

    const translatePct = 100 / cardsPerView

    if (!products || products.length === 0) return null

    return (
        <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Featured Products</h2>

            <div className="relative">
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentIndex * translatePct}%)` }}
                    >
                        {products.map((product) => {
                            const isInStock = calculateInStock(product.inStock, product.inventory)

                            return (
                                <div
                                    key={product.id}
                                    className="shrink-0 px-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/5"
                                >
                                    <Link href={`/products/${product.slug || product.id}`} className="block">
                                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-0 rounded-xl group">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {!isInStock && (
                                                        <div className="absolute top-3 left-3">
                                                            <Badge
                                                                className="text-[#F2F0E5]"
                                                                style={{ backgroundColor: "#BB4E2C" }}
                                                            >
                                                                Out of Stock
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-base font-semibold mb-2 line-clamp-2 min-h-12">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-lg font-bold text-[#1a3126]">
                                                        Rs. {product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Prev button */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 p-2 sm:p-3 rounded-full bg-[#1a3126] text-white shadow-lg hover:bg-[#0f1f16] transition-colors"
                        aria-label="Previous products"
                    >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                )}

                {/* Next button */}
                {currentIndex < maxIndex && (
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 p-2 sm:p-3 rounded-full bg-[#1a3126] text-white shadow-lg hover:bg-[#0f1f16] transition-colors"
                        aria-label="Next products"
                    >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                )}

                {/* Indicators — only render after mount so server/client agree */}
                {mounted && maxIndex > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all ${
                                    i === currentIndex
                                        ? "bg-[#1a3126] w-8"
                                        : "bg-gray-300 w-2 hover:bg-gray-400"
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}