import Image from "next/image";

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
                className="object-cover hidden md:block"
                quality={90}
            />

            {/* Hero Content */}
            <div className="relative h-full container mx-auto max-w-7xl px-6 md:px-10 lg:px-6">
                <div className="h-full flex flex-col justify-start md:justify-start pt-16 md:pt-20 lg:pt-24">
                    <div className="max-w-2xl">
                        <h1 className="text-[#F2F0E5] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight mb-4">
                            Design &amp; Buy
                        </h1>
                        <p className="text-[#BB4E2C] text-lg font-bold tracking-[0.3em]">
                            Discover unparalleled <br/>designs crafted for you
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}