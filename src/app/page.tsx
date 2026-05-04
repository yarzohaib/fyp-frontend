import AboutSection from "@/components/about"
import { AboutStrip } from "@/components/about-strip"
import { FeaturedCarousel } from "@/components/featured-carousel"
import Hero from "@/components/Hero"
import Navbar from "@/components/navbar"
import { RedesignBanner } from "@/components/redesign-banner"
import { fetchProducts } from "@/lib/payload"
import { Product, CarouselProduct } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Home - Premium Furniture & Home Decor',
    description: 'Discover our exclusive collection of premium furniture and home decor items.',
    keywords: 'furniture, home decor, premium quality, interior design, modern furniture',
  };
}

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  let products: Product[] = []

  try {
    const data = await fetchProducts(12)
    products = data.docs || []
  } catch (err) {
    console.error("Error fetching products for homepage:", err)
    products = []
  }

  const carouselProducts: CarouselProduct[] = products.map((product) => ({
    id: product.id,
    name: product.title,
    slug: product.slug,
    price: product.pricing.price,
    image: buildImageUrl(product.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
    inStock: (product.inventory?.quantity ?? 0) > 0,
    inventory: product.inventory,
  }))

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* AI Redesign Banner */}
      <section className="bg-[#F2F0E5] pt-8 pb-0">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <RedesignBanner />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#F2F0E5] py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <FeaturedCarousel products={carouselProducts} />
        </div>
      </section>

      {/* Perks strip */}
      <AboutStrip />

      {/* About */}
      <section className="bg-[#F2F0E5] py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <AboutSection />
        </div>
      </section>
    </main>
  )
}