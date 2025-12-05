import { Search } from "lucide-react"

export function HeroSearch() {
    return (
        <div className="relative w-full bg-secondary/30 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
            <div
                className="h-32 sm:h-40 md:h-48 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/Hero1.webp')`,
                }}
            >
                <div className="flex h-full items-center justify-center px-2 sm:px-4">
                    <div className="w-full max-w-2xl">
                        <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 shadow-md sm:shadow-lg">
                            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Design with AI"
                                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
