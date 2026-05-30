import { Sparkles } from 'lucide-react'

export function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="w-14 h-14 bg-[#1A3126]/5 border border-[#1A3126]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#BB4E2C]" />
            </div>
            <div>
                <p className="text-sm font-semibold text-[#1A3126]">What are you looking for?</p>
                <p className="text-xs text-[#1A3126]/45 mt-1 max-w-[220px] mx-auto leading-relaxed">
                    Try &quot;a minimalist sofa under Rs. 50,000&quot; or &quot;wooden dining table for 6&quot;
                </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[260px]">
                {['Cozy living room sofa', 'Wooden dining set', 'Compact home office desk'].map(s => (
                    <div key={s} className="px-3 py-2 border border-gray-100 text-left text-[11px] text-[#1A3126]/50 hover:border-[#1A3126]/30 hover:text-[#1A3126] transition-colors cursor-default">
                        &quot;{s}&quot;
                    </div>
                ))}
            </div>
        </div>
    )
}
