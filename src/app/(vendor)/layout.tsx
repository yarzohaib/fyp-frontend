import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <ProtectedRoute requiredRole="vendor">{children}</ProtectedRoute>
}
