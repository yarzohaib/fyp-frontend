import { Home, Sparkles, ScanLine } from "lucide-react";

const perks = [
    {
        Icon: Home,
        title: "Curated Spaces",
        desc: "Hundreds of furniture pieces for every room style",
    },
    {
        Icon: Sparkles,
        title: "AI Redesign",
        desc: "Visualise your dream room before you buy",
    },
    {
        Icon: ScanLine,
        title: "AR Visualisation",
        desc: "See furniture in your space before you buy",
    },
];

export function AboutStrip() {
    return (
        <section className="bg-white py-14 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h2 className="text-3xl md:text-6xl font-serif font-medium text-[#1A3126] text-left md:text-center mb-10 md:mb-20">
                    Why DOMA
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1A3126]/15">
                    {perks.map(({ Icon, title, desc }) => (
                        <div key={title} className="flex flex-col items-center text-center px-8 py-8 sm:py-4">
                            <div className="mb-5 text-[#1A3126]">
                                <Icon className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <div className="text-base font-bold text-[#1A3126] mb-3">{title}</div>
                            <div className="text-sm text-[#1A3126]/55 leading-relaxed max-w-50">{desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
