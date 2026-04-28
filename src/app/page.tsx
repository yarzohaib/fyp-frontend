import AboutSection from "@/components/about"
import { FeaturedCarousel } from "@/components/featured-carousel"
//import { Footer } from "@/components/footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/navbar"

import { fetchProducts } from "@/lib/payload"
import { Product, CarouselProduct } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"
export const revalidate = 60;
// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Home - Premium Furniture & Home Decor',
    description: 'Discover our exclusive collection of premium furniture and home decor items. Transform your space with high-quality designs and unparalleled craftsmanship.',
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

  // Convert backend product → carousel product type
  const carouselProducts: CarouselProduct[] = products.map((product) => ({
    id: product.id,
    name: product.title,
    slug: product.slug,
    price: product.pricing.price,
    image:
      buildImageUrl(product.images?.[0]?.image?.url, baseUrl) ??
      "/placeholder.svg",
    inStock: (product.inventory?.quantity ?? 0) > 0,
    inventory: product.inventory,
  }))

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Featured Products Section */}
      <section className="bg-[#E6E4DF] py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <FeaturedCarousel products={carouselProducts} />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#E6E4DF] py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <AboutSection />
        </div>
      </section>

      {/* <Footer /> */}

 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'DOMA',
      description: 'Premium furniture and home décor',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logoo.jpg`,
      sameAs: [],
    }),
  }}
/>
    </main>
  )
}