import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-[80vh] w-full">
            {/* Mobile Background Image */}
            <Image
                src="/mobileHero.jpg"
                alt="Hero Background"
                fill
                priority
                className="object-cover md:hidden"
            />

            {/* Desktop Background Image */}
            <Image
                src="/Hero2.2.jpg"
                alt="Hero Background"
                fill
                priority
                className="object-cover hidden md:block"
            />

            {/* Overlay (optional, for better text visibility) */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text */}
            <div className="absolute w-full h-full flex items-end lg:items-end justify-center lg:justify-start px-10 pb-20">
                <h1 className="text-white text-4xl md:text-6xl font-bold">
                    Design &amp; Buy
                </h1>
            </div>
        </section>
    );
}
