"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    const { logout, isAuthenticated } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <Button
            onClick={handleLogout}
            size="sm"
            variant="outline"
            className="rounded-full px-6 flex items-center gap-2 bg-transparent"
        >
            <LogOut className="h-4 w-4" />
            Logout
        </Button>
    )
}
