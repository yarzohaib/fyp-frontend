"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Store } from "lucide-react"

export function AuthSelection() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            
            {/* 1. Mobile-Only Logo (Visible on Small Screens) */}
            {/* This div serves as the top header for mobile, displaying the dark logo on the light background */}
            <div className="p-6 bg-background lg:hidden flex justify-center">
                <Link href="/">
                    <div className="w-48 h-12 relative">
                        <Image
                            src="/logoo.jpg" // Dark logo variant for light background
                            alt="Company Logo"
                            fill
                            sizes="50vw"
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>

            {/* Left side - Selection (Dark Background: bg-foreground / #1A3126) */}
            {/* This column is full width on mobile, w-1/2 on desktop */}
            <div className="w-full lg:w-1/2 bg-foreground text-background flex flex-col items-center justify-center p-8 relative min-h-[50vh] lg:min-h-screen">
                
                {/* 2. Desktop Top-Left Logo (Visible on Large Screens) */}
                {/* Uses the light/terracotta logo, contrasting the dark background */}
                <Link href="/" className="absolute top-8 left-8 hidden lg:block">
                    <div className="w-40 h-10 relative">
                        <Image
                            src="/logoGreen.jpg" // Light logo variant for dark background
                            alt="Company Logo"
                            fill
                            sizes="20vw"
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Main Content */}
                <h1 className="text-4xl font-medium font-serif mb-12 mt-12 lg:mt-0">Login As</h1>

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

            {/* Right side - Branding (Light Background: bg-background / #F2F0E5) */}
            {/* This column is hidden on small screens and shows the welcome message on large screens */}
            <div className="hidden lg:w-1/2 lg:flex bg-background items-center justify-center p-8">
                <div className="text-center">
                    {/* Removed large logo from here as per instructions, only keeping text */}
                    <h2 className="text-5xl font-bold text-foreground mb-4">Welcome back!</h2>
                    <p className="text-xl text-foreground/70">It&#39;s good to have you back!</p>
                </div>
            </div>
        </div>
    )
}