import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="bg-foreground text-background mt-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <Image src="/NavbarLogo.webp" alt="DOMA" width={100} height={40} className="h-10 w-auto mb-4" />
                        <p className="text-sm text-background/70">Discover beautiful furniture and home decor for your space.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    Rooms
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4">Join Newsletter</h4>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="bg-background/20 border-background/30 text-background placeholder:text-background/50"
                            />
                            <Button size="icon" className="bg-accent text-background hover:bg-accent/90">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-background/70">
                    <p>&copy; 2025 DOMA. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/" className="hover:text-background transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/" className="hover:text-background transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
