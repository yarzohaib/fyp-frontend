import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export const dynamic = 'force-dynamic'

export default function SignupPage() {
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
            <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
                <div className="fixed left-0 top-0 w-1/2 h-screen flex flex-col items-center justify-center p-8">
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

                    <div className="text-center">
                        <h2 className="text-5xl font-medium font-serif mb-4 text-background">Join us!</h2>
                        <p className="text-xl text-background/70">Create your account to get started</p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8 min-h-screen">
                <SignupForm />
            </div>
        </div>
    )
}
