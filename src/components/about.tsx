import Image from "next/image";

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
                        <h2 className="text-white text-3xl md:text-4xl font-serif font-medium mb-4">
                            About DOMA
                        </h2>
                        <p className="text-white/95 text-base md:text-lg leading-relaxed">
                            At Doma, we believe your home should reflect your unique style and personality. We curate premium furniture and decor pieces that blend timeless elegance with modern design.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}