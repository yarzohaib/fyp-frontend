import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
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
    title: 'DOMA - Design & Buy',
    description: 'Discover our exclusive collection of premium furniture and home decor items.',
    keywords: 'furniture, home decor, premium quality, interior design, modern furniture',
  };
}

const CATEGORIES = [
  { number: "01", name: "Living Room", sub: "Sofas, Tables & More",   cat: "Living Room", image: "/livingroom.webp" },
  { number: "02", name: "Bedroom",     sub: "Beds, Wardrobes & More", cat: "Bedroom",     image: "/bedroom.webp"   },
  { number: "03", name: "Dining",      sub: "Tables, Chairs & More",  cat: "Dining",      image: "/dining.webp"    },
  { number: "04", name: "Office",      sub: "Desks, Shelving & More", cat: "Office",      image: "/office.webp"    },
]

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  let products: Product[] = []

  try {
    const data = await fetchProducts(200)
    products = data.docs || []
  } catch (err) {
    console.error("Error fetching products for homepage:", err)
    products = []
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-10 md:mb-14">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#BB4E2C] mb-3">Collections</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-[#1A3126]">Shop by Room</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?cat=${encodeURIComponent(cat.cat)}`}
                className="group relative bg-[#1A3126] overflow-hidden aspect-[3/4] flex flex-col justify-end"
              >
                {/* Background image with subtle zoom on hover */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Dark overlay so text stays readable */}
                <div className="absolute inset-0 bg-[#1A3126]/55 group-hover:bg-[#1A3126]/45 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10 p-5 md:p-6">
                  <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1.5">{cat.sub}</p>
                  <h3 className="text-white text-xl md:text-2xl font-serif font-medium mb-4">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-[#BB4E2C] group-hover:w-10 transition-all duration-400" />
                    <ArrowRight className="w-3 h-3 text-[#BB4E2C] group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-t border-[#1A3126]/6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <FeaturedCarousel products={carouselProducts} />
        </div>
      </section>

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
                <span>Explore Collection</span>
                <span className="h-px w-8 bg-white/40 group-hover:w-14 transition-all duration-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Redesign Banner ────────────────────────────────────────────── */}
      <section className="bg-white pt-14 md:pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <RedesignBanner />
        </div>
      </section>

      {/* ── Perks strip ──────────────────────────────────────────────────── */}
      <AboutStrip />

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <AboutSection />
        </div>
      </section>
    </main>
  )
}
