"use client"

import Link from "next/link"
import { ShoppingBag, Store } from "lucide-react"

export function AuthSelection() {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Selection */}
            <div className="w-1/2 bg-foreground text-background flex flex-col items-center justify-center p-8">
                <h1 className="text-4xl font-bold mb-12">Login as:</h1>

                <div className="space-y-6 w-full max-w-xs">
                    {/* Vendor */}
                    <Link
                        href="/login/vendor"
                        className="flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-background rounded-2xl p-8 transition-colors"
                    >
                        <Store className="w-12 h-12" />
                        <span className="text-2xl font-semibold">Vendor</span>
                    </Link>

                    {/* Customer */}
                    <Link
                        href="/login/customer"
                        className="flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-background rounded-2xl p-8 transition-colors"
                    >
                        <ShoppingBag className="w-12 h-12" />
                        <span className="text-2xl font-semibold">Customer</span>
                    </Link>
                </div>

                <p className="mt-12 text-center text-background/70">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-accent font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Right side - Branding */}
            <div className="w-1/2 bg-background flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-5xl font-bold text-foreground mb-4">Welcome back!</h2>
                    <p className="text-xl text-foreground/70">It&#39;s good to have you back!</p>
                </div>
            </div>
        </div>
    )
}
