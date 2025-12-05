// import type React from "react"
// import { ProtectedRoute } from "@/components/protected-route"

// export default function VendorLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     return <ProtectedRoute requiredRole="vendor">{children}</ProtectedRoute>
// }

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import Sidebar from "@/components/vendor/sidebar"
import MobileSidebar from "@/components/vendor/mobileSidebar"
import Navbar from "@/components/vendor/navbar"

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute requiredRole="vendor">
            <div className="min-h-screen bg-background antialiased flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 border-r bg-card">
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar */}
                <MobileSidebar />

                <main className="flex-1 min-h-screen">
                    <Navbar />
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    )
}