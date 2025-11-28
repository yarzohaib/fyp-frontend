import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
//import Navbar2 from "@/components/navbar2"
import { ProductDetails } from "@/components/product-details"
import { ProductTabs } from "@/components/product-tabs"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { RelatedProducts } from "@/components/related-products"
import React from "react"
//import Navbar2 from "@/components/navbar2"
import { buildImageUrl } from "@/lib/utils"

interface Product {
    id: string
    slug: string
    title: string
    description: string
    shortDescription: string
    pricing: {
        price: number
        comparePrice?: number
    }
    images: Array<{
        image: {
            url: string
        }
    }>
    inStock: boolean
    category?: {
        id: string
        name: string
    }
    colors?: Array<{
        name: string
        hex: string
    }>
    specifications?: string
    materials?: string
    warranty?: string
}

async function getProduct(slugOrId: string): Promise<Product | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    try {
        let res = await fetch(`${baseUrl}/api/products?where[slug][equals]=${slugOrId}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            if (data.docs?.[0]) {
                return data.docs[0]
            }
        }

        // If slug lookup fails, try fetching by ID
        res = await fetch(`${baseUrl}/api/products?where[id][equals]=${slugOrId}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            return data.docs?.[0] || null
        }

        return null
    } catch (error) {
        console.error("[v0] Error fetching product:", error)
        return null
    }
}

async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    try {
        const res = await fetch(`${baseUrl}/api/products?where[category][equals]=${categoryId}&limit=3`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!res.ok) return []

        const data = await res.json()
        return (data.docs || []).filter((p: Product) => p.id !== currentProductId)
    } catch (error) {
        console.error("[v0] Error fetching related products:", error)
        return []
    }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug)

    if (!product) {
        notFound()
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const relatedProducts = product.category ? await getRelatedProducts(product.category.id, product.id) : []

    const productImages =
        product.images?.map((img) => ({
            url: buildImageUrl(img.image.url, baseUrl) ?? "/placeholder.svg",
            alt: product.title,
        })) || [{ url: "/placeholder.svg", alt: product.title }]

    return (
        <div className="min-h-screen bg-background">
            {/* <Navbar2 /> */}

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-8 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Link>

                {/* Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Gallery */}
                    <ProductGallery images={productImages} />

                    {/* Details */}
                    <ProductDetails
                        product={{
                            id: product.id,
                            title: product.title,
                            price: product.pricing.price,
                            comparePrice: product.pricing.comparePrice,
                            description: product.description,
                            inStock: product.inStock,
                            colors: product.colors,
                        }}
                    />
                </div>

                {/* Tabs Section */}
                <ProductTabs
                    specifications={product.specifications}
                    materials={product.materials}
                    warranty={product.warranty}
                    description={product.description}
                />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <RelatedProducts
                        products={relatedProducts.map((p) => ({
                            id: p.id,
                            slug: p.slug,
                            title: p.title,
                            price: p.pricing.price,
                            image: buildImageUrl(p.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
                            inStock: p.inStock,
                        }))}
                    />
                )}
            </main>

            <Footer />
        </div>
    )
}
