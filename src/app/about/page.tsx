import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "About DOMA – Design & Buy",
    description: "Learn about DOMA's mission to redefine how you experience spaces through AI and augmented reality.",
};

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C] mb-4">
                            About DOMA – Design &amp; Buy
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A3126] leading-tight">
                            Redefining How You<br />Experience Spaces
                        </h1>
                        <div className="mt-6 w-12 h-0.5 bg-[#BB4E2C]" />
                    </div>

                    {/* Our Story */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-[#1A3126] mb-4">Our Story</h2>
                        <p className="text-[#212529] leading-relaxed">
                            Welcome to DOMA, where cutting-edge technology meets exceptional interior design. Our platform is a smart
                            e-commerce ecosystem designed to completely transform how you discover, visualize, and purchase furniture
                            and home decor. Born from a vision to modernize the digital marketplace and solve real-world retail
                            challenges, DOMA was developed to bridge the gap between skilled furniture vendors and passionate buyers.
                            We believe that buying furniture online shouldn&apos;t be a guessing game, and selling it shouldn&apos;t
                            require an expensive photography studio.
                        </p>
                    </section>

                    <div className="border-t border-[#1A3126]/10 mb-10" />

                    {/* The Technology */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-[#1A3126] mb-4">The Technology</h2>
                        <p className="text-[#212529] leading-relaxed mb-6">
                            At DOMA, we leverage advanced Artificial Intelligence and Augmented Reality to create a seamless shopping
                            experience.
                        </p>
                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0 translate-y-1.5" />
                                <div>
                                    <span className="font-semibold text-[#1A3126]">For Buyers: </span>
                                    <span className="text-[#212529] leading-relaxed">
                                        Our proprietary AI Room Redesign tool allows you to upload a photo of your space and instantly
                                        see it styled with new furniture. Paired with our AR module, you can visualize exactly how a
                                        piece will fit into your room before you ever click &ldquo;Add to Cart.&rdquo;
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0 translate-y-1.5" />
                                <div>
                                    <span className="font-semibold text-[#1A3126]">For Vendors: </span>
                                    <span className="text-[#212529] leading-relaxed">
                                        We provide a powerful, tech-driven storefront. Our platform acts as a virtual studio, allowing
                                        creators and merchants to easily showcase their inventory to a targeted audience with modern,
                                        smart recommendation systems.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-[#1A3126]/10 mb-10" />

                    {/* Our Mission */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-[#1A3126] mb-4">Our Mission</h2>
                        <p className="text-[#212529] leading-relaxed">
                            Whether you are curating a sleek minimalist living room or listing your latest custom-built table, DOMA
                            provides the infrastructure. We are committed to prioritizing user-focused design, ensuring that every
                            interaction on our platform&mdash;from the first search to the final checkout&mdash;is intuitive, secure,
                            and inspiring.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="mt-14 p-8 bg-[#1A3126]  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <p className="text-white font-semibold text-lg">Ready to redesign your space?</p>
                            <p className="text-white/60 text-sm mt-1">Explore our collection or try the AI room redesign tool.</p>
                        </div>
                        <a
                            href="/products"
                            className="shrink-0 bg-[#BB4E2C] text-white px-6 py-3  font-semibold text-sm
                                       hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Shop Now
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
