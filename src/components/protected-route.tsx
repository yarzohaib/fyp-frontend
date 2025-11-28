// "use client"

// import { useAuth } from "@/contexts/auth-context"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import type { ReactNode } from "react"

// interface ProtectedRouteProps {
//     children: ReactNode
//     requiredRole?: "customer" | "vendor"
// }

// export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
//     const { isAuthenticated, user, isLoading } = useAuth()
//     const router = useRouter()

//     useEffect(() => {
//         if (!isLoading && !isAuthenticated) {
//             router.push("/login")
//         } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
//             router.push("/")
//         }
//     }, [isAuthenticated, isLoading, requiredRole, user?.role, router])

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground" />
//             </div>
//         )
//     }

//     if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
//         return null
//     }

//     return <>{children}</>
// }


"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: "customer" | "vendor"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login")
            return
        }

        if (!isLoading && requiredRole && user?.role !== requiredRole) {
            router.push("/")
            return
        }

        // ⭐ Vendor status check
        if (
            !isLoading &&
            requiredRole === "vendor" &&
            user?.role === "vendor" &&
            user?.status !== "approved"
        ) {
            router.push("/status")
            return
        }
    }, [isAuthenticated, isLoading, requiredRole, user?.role, user?.status, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground" />
            </div>
        )
    }

    if (
        !isAuthenticated ||
        (requiredRole && user?.role !== requiredRole) ||
        (requiredRole === "vendor" && user?.status !== "approved")
    ) {
        return null
    }

    return <>{children}</>
}
