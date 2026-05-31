"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import type { PublicVendor } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"

interface VendorCarouselProps {
    vendors: PublicVendor[]
    baseUrl: string
}

const GAP = 8

export function VendorCarousel({ vendors, baseUrl }: VendorCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [cardW, setCardW] = useState(0)
    const [idx, setIdx]     = useState(0)
    const [trans, setTrans] = useState(true)

    const N     = vendors.length
    const items = N > 0 ? [...vendors, ...vendors] : []

    useEffect(() => {
        function measure() {
            if (!containerRef.current) return
            const cols = window.innerWidth >= 768 ? 5 : 2
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
                {items.map((vendor, i) => {
                    const hasLogo = !!vendor.storeLogo?.url
                    const imgSrc = hasLogo
                        ? (buildImageUrl(vendor.storeLogo!.url, baseUrl) ?? "/profilePlaceholder.png")
                        : "/profilePlaceholder.png"

                    return (
                        <Link
                            key={`${vendor.id}-${i}`}
                            href={`/store/${vendor.id}`}
                            style={{ width: cardW > 0 ? cardW : undefined }}
                            className={`shrink-0 min-w-[calc(40%-4px)] md:min-w-[calc(20%-6px)] group relative overflow-hidden aspect-square flex flex-col justify-end shadow-xl ${
                                    hasLogo ? "bg-[#1A3126]" : "bg-[#1A3126]/70"
                                }`}
                        >
                            <Image
                                src={imgSrc}
                                alt={vendor.storeName}
                                fill
                                className={`transition-transform duration-700 group-hover:scale-105 ${
                                    hasLogo
                                        ? "object-cover"
                                        : "object-contain p-10 opacity-50"
                                }`}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-[#1A3126]/90 via-[#1A3126]/30 to-transparent group-hover:from-[#1A3126]/80 transition-all duration-500" />

                            <div className="relative z-10 p-5 md:p-6">
                                <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-1.5">Vendor</p>
                                <h3 className="text-white text-xl md:text-2xl font-serif font-medium">{vendor.storeName}</h3>
                                {vendor.contactInfo?.city && (
                                    <p className="text-white/50 text-xs mt-1">{vendor.contactInfo.city}</p>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
