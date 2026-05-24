import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[60vh] md:h-[110vh] w-full overflow-hidden">
            {/* Background Image — same source for all screens, cropped via object-cover */}
            <Image
                src="/test.jpg"
                alt="Hero Background"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                quality={90}
                className="object-cover object-[center_40%]"
            />

            {/* Gradient overlay — heavier at bottom so text reads cleanly */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />

            {/* Hero Content — anchored to bottom for editorial premium feel */}
            <div className="relative h-full container mx-auto max-w-7xl px-6 md:px-10 lg:px-8">
                {/* Mobile: centred layout */}
                <div className="h-full flex flex-col items-center justify-center text-center md:hidden pb-8">
                    <h1 className="text-[#F2F0E5] text-5xl font-serif font-medium leading-none mb-4 whitespace-nowrap">
                        Design &amp; Buy
                    </h1>
                    <p className="text-[#F2F0E5]/80 text-[10px] font-semibold tracking-[0.35em] uppercase mb-7">
                        Discover unparalleled designs crafted for you
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="/products"
                            className="bg-[#BB4E2C] text-white px-6 py-3 rounded-lg font-semibold text-sm
                                       hover:bg-orange-600 transition-all duration-300 shadow-sm"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/redesign"
                            className="bg-white/15 backdrop-blur-sm text-[#F2F0E5] border border-white/40
                                       px-6 py-3 rounded-lg font-medium text-sm
                                       hover:bg-white/25 transition-all duration-300"
                        >
                            Redesign
                        </Link>
                    </div>
                </div>

                {/* Desktop: bottom-anchored editorial layout */}
                <div className="h-full hidden md:flex flex-col justify-end pb-28 lg:pb-36">
                    <div className="max-w-4xl">
                        <h1 className="text-[#F2F0E5] text-8xl lg:text-[9rem] font-serif font-medium leading-[0.92] mb-5">
                            Design &amp; Buy
                        </h1>
                        <p className="text-[#F2F0E5]/80 text-sm font-semibold tracking-[0.4em] uppercase mb-10">
                            Discover unparalleled designs crafted for you
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/products"
                                className="bg-[#BB4E2C] text-white px-9 py-4 rounded-lg font-semibold text-base
                                           hover:bg-orange-600 transition-all duration-300
                                           shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/redesign"
                                className="bg-white/15 backdrop-blur-sm text-[#F2F0E5] border border-white/40
                                           px-9 py-4 rounded-lg font-medium text-base
                                           hover:bg-white/25 transition-all duration-300"
                            >
                                Redesign a Room
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
{/* 
            {/* Scroll indicator — positioned to stay within the visible viewport
            <div className="absolute bottom-[13vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
                <div className="w-px h-8 bg-white/50" />
                <span className="text-white/50 text-[10px] font-medium tracking-[0.15em] uppercase">Scroll</span>
            </div> */} 
        </section>
    );
}