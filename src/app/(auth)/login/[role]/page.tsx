import { LoginForm } from "@/components/login-form"
import type { UserRole } from "@/contexts/auth-context"

export default function LoginPage({ params }: { params: { role: string } }) {
    const role = (params.role as UserRole) === "vendor" ? "vendor" : "customer"

    return (
        <div className="min-h-screen flex">
            {/* Left side */}
            <div className="hidden md:flex w-1/2 bg-foreground text-background flex-col items-center justify-center p-8">
                <h2 className="text-5xl font-bold mb-4">Welcome back!</h2>
                <p className="text-xl text-background/70 text-center">Enter your credentials to access your {role} account</p>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8">
                <LoginForm role={role} />
            </div>
        </div>
    )
}
