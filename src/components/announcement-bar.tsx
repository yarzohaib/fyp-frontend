const MESSAGES = [
    "VISUALISE BEFORE YOU BUY",
    "AI ROOM REDESIGN",
    "SEE FURNITURE IN YOUR SPACE",
    "IMMERSIVE AR SHOPPING",
]

// Render 2 identical sets so the loop is seamless:
// total width = 8 items × 33vw = 264vw
// animation moves -50% = -132vw = exactly one set (4 × 33vw) ✓
const double = [...MESSAGES, ...MESSAGES]

export function AnnouncementBar() {
    return (
        <div className="bg-[#BB4E2C] overflow-hidden h-9 flex items-center">
            <div className="animate-marquee">
                {double.map((msg, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center justify-center gap-3 text-white/90 text-[11px] font-semibold tracking-[0.22em] uppercase select-none shrink-0"
                        style={{ width: "33vw" }}
                    >
                        <span className="text-white/40 text-[8px]"></span>
                        {msg}
                    </span>
                ))}
            </div>
        </div>
    )
}
