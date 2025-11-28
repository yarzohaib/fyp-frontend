"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function FilterBar({ resultCount }: { resultCount: number }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">Displaying {resultCount} results</p>

            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Sort by:</span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full border-border bg-transparent">
                            Color
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>All Colors</DropdownMenuItem>
                        <DropdownMenuItem>Brown</DropdownMenuItem>
                        <DropdownMenuItem>Beige</DropdownMenuItem>
                        <DropdownMenuItem>Green</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full border-border bg-transparent">
                            Rooms
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>All Rooms</DropdownMenuItem>
                        <DropdownMenuItem>Living Room</DropdownMenuItem>
                        <DropdownMenuItem>Bedroom</DropdownMenuItem>
                        <DropdownMenuItem>Dining Room</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full border-border bg-transparent">
                            Collections
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>All Collections</DropdownMenuItem>
                        <DropdownMenuItem>Modern</DropdownMenuItem>
                        <DropdownMenuItem>Classic</DropdownMenuItem>
                        <DropdownMenuItem>Minimalist</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
