import { Search } from "lucide-react"

export function HeroSearch() {
    return (
        <div className="relative w-full bg-secondary/30 rounded-2xl overflow-hidden">
            <div
                className="h-48 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/Hero1.webp')`,
                }}
            >
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-2xl px-4">
                        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Design with AI"
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
