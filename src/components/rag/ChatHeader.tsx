export function ChatHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#BB4E2C]"></span>
          <p className="uppercase text-xs font-bold tracking-[0.3em] text-[#BB4E2C]">
            DOMA
          </p>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-[#1a3126]">
          Curate your space.
        </h1>
      </div>
      <p className="text-[#1a3126]/70 text-sm md:text-base max-w-sm leading-relaxed border-l-2 border-[#1a3126]/10 pl-4">
       Hey{', '}I am Genie. Your AI-powered interior design assistant. Describe your vibe{', '}and I&apos;ll find the pieces that match your home.
      </p>
    </div>
  );
}
