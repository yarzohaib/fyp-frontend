import Link from "next/link"
import { Sparkles } from "lucide-react"

export function RedesignBanner() {
  return (
    <Link href="/redesign">
      <div className="cursor-pointer group bg-[#1A3126] min-h-75 md:min-h-90 flex items-center justify-center">

        {/* Centred content */}
        <div className="flex flex-col items-center text-center px-6 py-12 gap-4">

          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            {/* <Sparkles className="w-4 h-4 text-[#BB4E2C]" /> */}
            <span className="text-xs font-bold uppercase text-[#BB4E2C]">
              EXPERIENCE
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-serif font-medium text-[#ffffff] leading-tight">
            DOMA Redesign
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
