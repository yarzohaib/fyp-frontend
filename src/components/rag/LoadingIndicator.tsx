export function LoadingIndicator() {
    return (
        <div className="max-w-[85%] mr-auto">
            <span className="text-[10px] uppercase tracking-widest text-[#BB4E2C] mb-1.5 block">
                DOMA Sense
            </span>
            <div className="bg-white border border-gray-100 px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce" />
                </div>
                <span className="text-xs text-[#1A3126]/40 font-medium">Finding the best picks...</span>
            </div>
        </div>
    )
}
