import type React from "react"
import Navbar from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute requiredRole="customer">
            <Navbar />
            <div className="pt-20 sm:pt-24">{children}</div>
        </ProtectedRoute>
    )
}
