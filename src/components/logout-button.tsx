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
            className="bg-[#BB4E2C] text-white px-5 py-2.5 rounded-none font-semibold
                     hover:bg-orange-500 transition-all duration-300 
                     shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                     flex items-center gap-2"
        >
            <LogOut className="h-4 w-4" />
            Logout
        </Button>
    )
}