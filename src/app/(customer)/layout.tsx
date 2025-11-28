import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>
}
