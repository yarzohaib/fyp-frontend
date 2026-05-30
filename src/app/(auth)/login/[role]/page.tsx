import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form"
import type { UserRole } from "@/contexts/auth-context"
export const dynamic = 'force-dynamic'
export default async function LoginPage({ 
    params 
}: { 
    params: Promise<{ role: string }> 
}) {
    const { role: roleParam } = await params;
    const role = (roleParam as UserRole) === "vendor" ? "vendor" : "customer"

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Mobile-Only Logo */}
            <div className="p-6 bg-background lg:hidden flex justify-center">
                <Link href="/">
                    <div className="w-48 h-12 relative">
                        <Image
                            src="/GreenLogo.png"
                            alt="Company Logo"
                            fill
                            sizes="50vw"
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>

            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col items-center justify-center p-8 relative">
                {/* Desktop Logo */}
                <Link href="/" className="absolute top-8 left-8">
                    <div className="w-40 h-10 relative">
                        <Image
                            src="/WhiteLogo.png"
                            alt="Company Logo"
                            fill
                            sizes="20vw"
                            className="object-contain"
                        />
                    </div>
                </Link>

                <h2 className="text-5xl font-medium font-serif mb-4">Welcome back!</h2>
                <p className="text-xl text-background/70 text-center">Enter your credentials to access your {role} account</p>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8 min-h-screen">
                <LoginForm role={role} />
            </div>
        </div>
    )
}