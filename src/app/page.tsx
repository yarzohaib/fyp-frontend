import Link from "next/link"
import { AboutStrip } from "@/components/about-strip"
import { CategoryCarousel } from "@/components/category-carousel"
import { FeaturedCarousel } from "@/components/featured-carousel"
import Hero from "@/components/Hero"
import Navbar from "@/components/navbar"
import { RedesignBanner } from "@/components/redesign-banner"
import { VendorCarousel } from "@/components/vendor-carousel"
import { fetchProducts, fetchCategories } from "@/lib/payload"
import { Product, CarouselProduct, Category, PublicVendor } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'DOMA - Design & Buy',
    description: 'Discover our exclusive collection of premium furniture and home decor items.',
    keywords: 'furniture, home decor, premium quality, interior design, modern furniture',
  };
}


export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  let products: Product[] = []
  let categories: Category[] = []
  let vendors: PublicVendor[] = []

  const [productsResult, categoriesResult] = await Promise.allSettled([
    fetchProducts(200, 2),
    fetchCategories(),
  ])

  if (productsResult.status === "fulfilled") {
    products = productsResult.value.docs || []
  } else {
    console.error("Error fetching products for homepage:", productsResult.reason)
  }

  if (categoriesResult.status === "fulfilled") {
    categories = categoriesResult.value.docs || []
  } else {
    console.error("Error fetching categories for homepage:", categoriesResult.reason)
  }

  // Extract unique vendors from embedded product data (same pattern as store page)
  const vendorMap = new Map<string, PublicVendor>()
  products.forEach(p => {
    if (p.vendor && typeof p.vendor === "object") {
      vendorMap.set(p.vendor.id, p.vendor as PublicVendor)
    }
  })
  vendors = Array.from(vendorMap.values())

  const carouselProducts: CarouselProduct[] = products
    .filter((product) => product.model3dStatus === "ready")
    .map((product) => ({
      id: product.id,
      name: product.title,
      slug: product.slug,
      price: product.pricing.price,
      discountedPrice: product.pricing.discountedPrice,
      image: buildImageUrl(product.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
      inStock: (product.inventory?.quantity ?? 0) > 0,
      inventory: product.inventory,
    }))

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Shop by Category ──────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 md:mb-14">
          <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#BB4E2C] mb-3">CATALOGUE</p>
          <h2 className="text-4xl md:text-6xl font-serif font-medium text-[#1A3126]">Shop by Collections</h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* ── AI Redesign Banner ────────────────────────────────────────────── */}
      <RedesignBanner />

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-t border-[#1A3126]/6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <FeaturedCarousel products={carouselProducts} />
        </div>
      </section>

{/* ── Perks strip ──────────────────────────────────────────────────── */}
      <AboutStrip />

      {/* ── Editorial dark section ────────────────────────────────────────── */}
      <section className="bg-[#1A3126] py-20 md:py-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#BB4E2C] mb-6">SMART INTERIOR SHOPPING</p>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-[0.9] mb-8">
                See it.<br/>Style it.<br/>Buy it.
              </h2>
            </div>
            <div>
              <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10">
                Visualize furniture in your own room using AR and receive personalized AI-powered interior recommendations tailored to your style.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-4 text-white text-sm tracking-[0.18em] uppercase group"
              >
                <span>Explore Catalogue</span>
                <span className="h-px w-8 bg-white/40 group-hover:w-14 transition-all duration-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      {/* ── Top Vendors ──────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 md:mb-14">
          <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#BB4E2C] mb-3">Sellers</p>
          <h2 className="text-4xl md:text-6xl font-serif font-medium text-[#1A3126]">Our Vendors</h2>
        </div>
        <div className="max-w-7xl mx-auto">
          <VendorCarousel vendors={vendors} baseUrl={baseUrl} />
        </div>
      </section>
    </main>
  )
}
