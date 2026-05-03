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
        <section className="bg-white border-t border-[#1A3126]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-9">
                <div className="flex flex-col sm:flex-row items-start justify-center gap-8 sm:gap-16">
                    {perks.map(({ Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                            <div className="mt-0.5 text-[#1A3126] shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-[#1A3126] mb-0.5">{title}</div>
                                <div className="text-xs text-[#6C757D] leading-relaxed">{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
