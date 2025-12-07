"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductGalleryProps } from "@/lib/Types"

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
                <Image
                    src={images[selectedIndex]?.url || "/placeholder.svg"}
                    alt={images[selectedIndex]?.alt || "Product"}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevious}
                        className="bg-background/80 hover:bg-background text-foreground"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="bg-background/80 hover:bg-background text-foreground"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedIndex === index ? "border-accent" : "border-border"
                                }`}
                        >
                            <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
