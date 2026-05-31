import { notFound } from "next/navigation"
import Image from "next/image"
import { Store } from "lucide-react"
import Navbar from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { fetchPublicVendorProducts } from "@/lib/payload"
import { buildImageUrl } from "@/lib/utils"
import type { PublicVendor } from "@/lib/Types"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const products = await fetchPublicVendorProducts(id, 1)
    const vendor = products[0]?.vendor && typeof products[0].vendor === "object"
        ? products[0].vendor as PublicVendor
        : null
    if (!vendor) return { title: "Store – DOMA" }
    return {
        title: `${vendor.storeName} – DOMA`,
        description: vendor.storeDescription || `Browse products from ${vendor.storeName} on DOMA.`,
    }
}

export default async function VendorStorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    const products = await fetchPublicVendorProducts(id)

    // Extract vendor info from the first product's embedded vendor object
    const vendor = products[0]?.vendor && typeof products[0].vendor === "object"
        ? products[0].vendor as PublicVendor
        : null

    // If no products AND no vendor info at all, 404
    if (products.length === 0 && !vendor) notFound()

    const logoUrl = vendor?.storeLogo?.url
        ? buildImageUrl(vendor.storeLogo.url, baseUrl)
        : null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Store header banner */}
            <div className="bg-[#1A3126] pt-24 pb-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-4">

                    {/* Logo / avatar */}
                    <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={vendor?.storeName ?? "Store"}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <Store className="w-10 h-10 text-white/60" />
                        )}
                    </div>

                    {/* Store name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {vendor?.storeName ?? "Store"}
                    </h1>

                    {/* Description */}
                    {vendor?.storeDescription && (
                        <p className="text-white/60 text-sm max-w-md leading-relaxed">
                            {vendor.storeDescription}
                        </p>
                    )}

                    {/* Product count badge */}
                    <span className="bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                        {products.length} {products.length === 1 ? "Product" : "Products"} Available
                    </span>

                    {/* Location */}
                    {vendor?.contactInfo?.city && (
                        <p className="text-white/40 text-xs">
                            {[vendor.contactInfo.city, vendor.contactInfo.country].filter(Boolean).join(", ")}
                        </p>
                    )}
                </div>
            </div>

            {/* Accent divider */}
            <div className="h-1 bg-[#BB4E2C]" />

            {/* Products grid */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-foreground/40">
                        <Store className="w-16 h-16" />
                        <p className="text-lg font-medium">No products yet</p>
                        <p className="text-sm">This store hasn't listed any products.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => {
                            const firstImage = product.images?.[0]?.image?.url
                            const secondImage = product.images?.[1]?.image?.url
                            return (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    slug={product.slug}
                                    title={product.title}
                                    price={product.pricing.price}
                                    discountedPrice={product.pricing.discountedPrice}
                                    image={firstImage ? buildImageUrl(firstImage, baseUrl) ?? "/placeholder.svg" : "/placeholder.svg"}
                                    secondImage={secondImage ? buildImageUrl(secondImage, baseUrl) ?? undefined : undefined}
                                    inStock={(product.inventory?.quantity ?? 0) > 0}
                                    inventory={product.inventory}
                                />
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
