import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ProductDetails } from "@/components/product-details"
import { ProductTabs } from "@/components/product-tabs"
//import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { RelatedProducts } from "@/components/related-products"
import React from "react"
import { buildImageUrl } from "@/lib/utils"
import { fetchProductBySlugOrId, fetchRelatedProducts } from "@/lib/payload"

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const product = await fetchProductBySlugOrId(slug)
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      }
    }

    return {
      title: `${product.title} - Premium Furniture & Home Décor`,
      description: product.shortDescription || product.Description || `Discover ${product.title} - a premium furniture piece from our exclusive collection. High-quality design and craftsmanship.`,
      keywords: `${product.title}, furniture, home décor, ${product.category?.name || 'premium furniture'}, buy online`,
      openGraph: {
        title: product.title,
        description: product.shortDescription || product.Description,
        images: product.images?.[0]?.image?.url ? [{ url: buildImageUrl(product.images[0].image.url, process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') }] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Product',
      description: 'Browse our premium furniture collection.',
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await fetchProductBySlugOrId(slug)

    if (!product) {
        notFound()
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const relatedProducts = product.category ? await fetchRelatedProducts(product.category.id, product.id) : []

    const productImages =
        product.images?.map((img) => ({
            url: buildImageUrl(img.image.url, baseUrl) ?? "/placeholder.svg",
            alt: product.title,
        })) || [{ url: "/placeholder.svg", alt: product.title }]

    // Calculate inStock from inventory quantity
    const inStock = (product.inventory?.quantity ?? 0) > 0

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Breadcrumb */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-6 sm:mb-8 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Link>

                {/* Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
                    {/* Gallery */}
                    <ProductGallery images={productImages} />

                    {/* Details */}
                    <ProductDetails
                        product={{
                            id: product.id,
                            title: product.title,
                            price: product.pricing.price,
                            comparePrice: product.pricing.comparePrice,
                            shortDescription: product.shortDescription || "",
                            Description: product.Description || "",
                            inStock: inStock,
                            colors: product.colors,
                            category: product.category?.name, 
                        }}
                    />
                </div>

                {/* Tabs Section */}
                <ProductTabs
                    specifications={product.specifications}
                    reviews={product.reviews}
                />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 lg:mt-16">
                        <RelatedProducts
                            products={relatedProducts.map((p) => ({
                                id: p.id,
                                slug: p.slug,
                                title: p.title,
                                price: p.pricing.price,
                                image: buildImageUrl(p.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
                                inStock: inStock,
                            }))}
                        />
                    </div>
                )}
            </main>

            {/* <Footer /> */}
        </div>
    )
}

