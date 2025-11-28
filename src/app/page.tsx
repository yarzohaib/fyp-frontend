// app/page.tsx
//import Navbar from "@/components/navbar";
import { FeaturedCarousel } from "@/components/featured-carousel";
import Hero from "@/components/Hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="bg-[#F2F0E5] px-10 pt-20">
        <h1 className="text-4xl font-bold">Discover Unparalleled Designs</h1>
      </div>
      <FeaturedCarousel />
      {/* <section className="pt-24 px-6">
        <h1 className="text-4xl font-bold">Welcome to My Website</h1>
        <p className="mt-4 text-gray-600">
          This is your homepage content.
        </p>
      </section> */}
    </main>
  );
}
