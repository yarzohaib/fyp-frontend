import Link from "next/link"
import { Sparkles } from "lucide-react"

export function RedesignBanner() {
  return (
    <Link href="/redesign">
      <div className="relative overflow-hidden rounded-2xl cursor-pointer group
                      bg-[#1A3126] hover:bg-[#27493a] transition-all duration-300
                      shadow-lg hover:shadow-[#1A3126]/30 hover:shadow-xl">

        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between px-6 py-5">
          {/* Left: icon + text */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10
                            group-hover:bg-white/20 transition-colors duration-300
                            flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-semibold text-base">
                  AI Room Redesign
                </span>
                <span className="bg-[#BB4E2C] text-white text-[10px]
                                 font-bold px-2 py-0.5 rounded-full tracking-wide">
                  NEW
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Upload a photo &amp; get your room styled instantly
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="shrink-0 ml-4">
            <span className="inline-flex items-center gap-1.5
                             bg-white text-[#BB4E2C] text-sm font-semibold
                             px-4 py-2 rounded-full
                             group-hover:bg-[#BB4E2C] group-hover:text-white
                             transition-all duration-300">
              Try it free
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}