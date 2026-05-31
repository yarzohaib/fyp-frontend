"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/lib/Types"

const CATEGORY_IMAGES: Record<string, string> = {
    "living room": "/livingroom.webp",
    "bedroom":     "/bedroom.webp",
    "dining":      "/dining.webp",
    "office":      "/office.webp",
    "sectional":   "/sectional.jpeg",
    "table":       "/table.jpeg",
    "chair":       "/chair.jpeg",
    "loveseat":    "/loveseat.jpeg",
}

interface CategoryCarouselProps {
    categories: Category[]
}

const GAP = 8 // px — gap between cards (gap-2)

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [cardW, setCardW] = useState(0)
    const [idx, setIdx]     = useState(0)
    const [trans, setTrans] = useState(true)

    const N     = categories.length
    const items = N > 0 ? [...categories, ...categories] : []

    useEffect(() => {
        function measure() {
            if (!containerRef.current) return
            const cols = window.innerWidth >= 768 ? 4 : 2
            // Account for gaps between the visible cards
            setCardW((containerRef.current.offsetWidth - (cols - 1) * GAP) / cols)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [])

    useEffect(() => {
        if (N < 2) return
        const id = setInterval(() => {
            setTrans(true)
            setIdx(i => i + 1)
        }, 3000)
        return () => clearInterval(id)
    }, [N])

    useEffect(() => {
        if (idx >= N) {
            const id = setTimeout(() => {
                setTrans(false)
                setIdx(0)
            }, 520)
            return () => clearTimeout(id)
        }
    }, [idx, N])

    useEffect(() => {
        if (!trans) {
            let raf2: number
            const raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setTrans(true))
            })
            return () => {
                cancelAnimationFrame(raf1)
                cancelAnimationFrame(raf2)
            }
        }
    }, [trans])

    if (N === 0) return null

    return (
        <div ref={containerRef} className="overflow-hidden">
            <div
                className="flex gap-2"
                style={{
                    transform: `translateX(${-idx * (cardW + GAP)}px)`,
                    transition: trans ? "transform 500ms ease-in-out" : "none",
                }}
            >
                {items.map((cat, i) => {
                    const image = CATEGORY_IMAGES[cat.name.toLowerCase()]
                    return (
                        <Link
                            key={`${cat.id}-${i}`}
                            href={`/products?cat=${encodeURIComponent(cat.name)}`}
                            style={{ width: cardW > 0 ? cardW : undefined }}
                            className="shrink-0 min-w-[calc(50%-4px)] md:min-w-[calc(25%-6px)] group relative bg-[#1A3126] overflow-hidden aspect-3/4 flex flex-col justify-end"
                        >
                            {image && (
                                <Image
                                    src={image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            )}
                            <div className="absolute inset-0 bg-[#1A3126]/55 group-hover:bg-[#1A3126]/45 transition-colors duration-500" />
                            <div className="relative z-10 p-5 md:p-6">
                                <h3 className="text-white text-xl md:text-2xl font-serif font-medium mb-4">{cat.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="h-px w-6 bg-[#BB4E2C] group-hover:w-10 transition-all duration-400" />
                                    <ArrowRight className="w-3 h-3 text-[#BB4E2C] group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
