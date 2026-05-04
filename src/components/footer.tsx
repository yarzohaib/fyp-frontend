import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-foreground text-background">

            {/* Top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#BB4E2C] to-transparent" />

            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-14 pb-10">

                {/* Main row */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">

                    {/* Brand block */}
                    <div className="max-w-xs">
                        <p className="text-3xl font-serif font-medium text-background tracking-wide mb-5">
                            DOMA
                        </p>
                        <p className="text-sm text-background/60 leading-relaxed">
                            Discover beautiful furniture and home decor for your space — powered by AI.
                        </p>
                        <p className="mt-5 text-xs font-bold tracking-[0.25em] uppercase text-[#BB4E2C]">
                            Design &amp; Buy
                        </p>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-16 gap-y-10">

                        {/* Shop */}
                        <div>
                            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-background/40 mb-5">
                                Shop
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/products" className="text-background/70 hover:text-background transition-colors duration-200">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-background/70 hover:text-background transition-colors duration-200">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-background/40 mb-5">
                                Support
                            </h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/contact" className="text-background/70 hover:text-background transition-colors duration-200">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="text-background/70 hover:text-background transition-colors duration-200">
                                        Shipping Info
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/40">
                    <p>&copy; 2026 DOMA. All rights reserved.</p>
                    <div className="flex items-center gap-5">
                        <Link href="/privacy" className="hover:text-background/70 transition-colors duration-200">
                            Privacy Policy
                        </Link>
                        <span className="w-px h-3 bg-background/20" />
                        <Link href="/terms" className="hover:text-background/70 transition-colors duration-200">
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}
