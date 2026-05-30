import Link from "next/link"
import { Sparkles } from "lucide-react"

export function RedesignBanner() {
  return (
    <Link href="/redesign">
      <div className="relative overflow-hidden cursor-pointer group bg-[#1A3126] min-h-[300px] md:min-h-[360px] flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow duration-500">

        {/* Always-running shimmer sweep */}
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shimmer pointer-events-none" />

        {/* Large ambient orb — top right */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#BB4E2C]/15 animate-pulse" />

        {/* Smaller orb — bottom left */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5" />

        {/* Twinkling dots */}
        <span className="absolute top-8  right-[30%] w-1.5 h-1.5 rounded-full bg-[#BB4E2C] animate-twinkle-1" />
        <span className="absolute top-14 right-[18%] w-1   h-1   rounded-full bg-white/50 animate-twinkle-2" />
        <span className="absolute bottom-10 left-[22%] w-1.5 h-1.5 rounded-full bg-[#BB4E2C]/70 animate-twinkle-3" />
        <span className="absolute bottom-7  left-[38%] w-1   h-1   rounded-full bg-white/40 animate-twinkle-4" />
        <span className="absolute top-6   left-[15%] w-1   h-1   rounded-full bg-white/30 animate-twinkle-2" />

        {/* Centred content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-12 gap-4">

          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#BB4E2C]" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C]">
              AI Powered
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-serif font-medium text-[#ffffff] leading-tight">
            DOMA Create
          </h2>

          {/* Sub-text */}
          <p className="text-white/55 text-sm max-w-xs leading-relaxed">
            Upload a photo of your room and let AI redesign it with beautiful furniture instantly.
          </p>

          {/* CTA */}
          <span className="mt-2 inline-flex items-center
                           bg-[#BB4E2C] text-white px-7 py-3
                           font-semibold text-sm
                           group-hover:bg-orange-500 group-hover:shadow-lg group-hover:shadow-[#BB4E2C]/40
                           transition-all duration-300">
            Try it
          </span>
        </div>

      </div>
    </Link>
  )
}
