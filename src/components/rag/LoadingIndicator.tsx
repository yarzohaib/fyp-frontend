export function LoadingIndicator() {
  return (
    <div className="max-w-md mr-auto">
      <span className="text-[10px] uppercase tracking-widest text-[#BB4E2C] mb-2 px-1 block">
        DOMA Sense
      </span>
      <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-[#F2F0E5] shadow-sm flex items-center gap-3">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#BB4E2C] rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs text-[#1a3126]/50 font-medium">
          Answering...
        </span>
      </div>
    </div>
  );
}
