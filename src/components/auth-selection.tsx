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
                    <div className="w-60 h-16 relative">
                        <Image
                            src="/DomaG.png"
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
                    <div className="w-56 h-14 relative">
                        <Image
                            src="/DomaW.png"
                            alt="Company Logo"
                            fill
                            sizes="20vw"
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Main Content */}
                <h1 className="text-5xl font-medium font-serif mb-12 mt-12 lg:mt-0">Login As</h1>

                <div className="space-y-6 w-full max-w-sm">
                    {/* Vendor */}
                    <Link
                        href="/login/vendor"
                        className="flex items-center justify-center gap-5 bg-accent hover:bg-accent/90 text-background p-9 transition-colors"
                    >
                        {/* <Store className="w-14 h-14" /> */}
                        <span className="text-3xl font-medium font-serif">Vendor</span>
                    </Link>

                    {/* Customer */}
                    <Link
                        href="/login/customer"
                        className="flex items-center justify-center gap-5 bg-accent hover:bg-accent/90 text-background p-9 transition-colors"
                    >
                        {/* <ShoppingBag className="w-14 h-14" /> */}
                        <span className="text-3xl font-medium font-serif">Customer</span>
                    </Link>
                </div>

                <p className="mt-12 text-center text-lg text-background/70">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-accent font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Right side - Branding */}
            <div className="hidden lg:w-1/2 lg:flex bg-background items-start justify-center p-12 relative overflow-hidden">
                <h2 className="text-4xl font-medium font-serif text-foreground relative z-10">Welcome back!</h2>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/Domaicon.png"
                        alt=""
                        fill
                        sizes="50vw"
                        className="object-contain opacity-100"
                    />
                </div>
            </div>
        </div>
    )
}