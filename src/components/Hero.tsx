import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
            {/* Mobile Background Image */}
            <Image
                src="/mobileHero.jpg"
                alt="Hero Background"
                fill
                priority
                className="object-cover md:hidden"
                quality={90}
            />

            {/* Desktop Background Image */}
            <Image
                src="/test.jpg"
                alt="Hero Background"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                quality={85}
                className="object-cover hidden md:block"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

            {/* Hero Content */}
            <div className="relative h-full container mx-auto max-w-7xl px-6 md:px-10 lg:px-6">
                <div className="h-full flex flex-col justify-start pt-16 md:pt-20 lg:pt-24">
                    <div className="max-w-2xl">
                        <h1 className="text-[#F2F0E5] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight mb-4">
                            Design &amp; Buy
                        </h1>
                        <p className="text-[#BB4E2C] text-base sm:text-lg font-bold tracking-[0.3em] uppercase">
                            Discover unparalleled <br className="hidden sm:block" />designs crafted for you
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="bg-[#BB4E2C] text-white px-7 py-3 rounded-lg font-semibold text-sm
                                           hover:bg-orange-600 transition-all duration-300
                                           shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/redesign"
                                className="bg-white/15 backdrop-blur-sm text-[#F2F0E5] border border-white/40
                                           px-7 py-3 rounded-lg font-medium text-sm
                                           hover:bg-white/25 transition-all duration-300"
                            >
                                Redesign a Room
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
                <div className="w-px h-8 bg-white/50" />
                <span className="text-white/50 text-[10px] font-medium tracking-[0.15em] uppercase">Scroll</span>
            </div>
        </section>
    );
}