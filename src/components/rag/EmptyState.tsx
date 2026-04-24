export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-[#1a3126]/40 space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#1a3126]/5 flex items-center justify-center text-2xl">
        🛋️
      </div>
      <p className="text-sm tracking-wide font-medium">
        Start the conversation to get curated picks.
      </p>
    </div>
  );
}
