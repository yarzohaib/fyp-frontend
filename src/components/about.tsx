import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
    return (
        <div className="relative h-[400px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-2xl">
            {/* Background Image */}
            <Image
                src="/aboutORG.webp"
                alt="About Doma"
                fill
                className="object-cover"
                quality={90}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Content Card */}
            <div className="absolute inset-0 flex items-center">
                <div className="ml-6 md:ml-12 lg:ml-16 max-w-md">
                    <div className="bg-[#1a3126] p-8 md:p-10 rounded-lg shadow-2xl">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                            About Doma
                        </h2>
                        <p className="text-white/95 text-base md:text-lg leading-relaxed mb-6">
                            At Doma, we believe your home should reflect your unique style and personality. We curate premium furniture and decor pieces that blend timeless elegance with modern design.
                        </p>
                        <Link
                            href="/about"
                            className="inline-block bg-white text-[#BB4E2C] px-6 py-3 rounded-lg font-semibold 
                                     hover:bg-gray-100 transition-all duration-300 
                                     shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}