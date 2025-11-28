
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";

// export default function Navbar() {
//     const [scrollY, setScrollY] = useState(0);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => setScrollY(window.scrollY);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     return (
//         <nav
//             className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white shadow-md" : "bg-transparent"
//                 }`}
//         >
//             <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//                 {/* Left side - Logo and Navigation Links */}
//                 <div className="flex items-center space-x-8">
//                     {/* Logo */}
//                     <Link href="/" className="flex items-center">
//                         <Image
//                             src="/NavbarLogo.webp"
//                             alt="Doma Logo"
//                             width={400}
//                             height={118}
//                             className="w-12 h-12"
//                         />
//                     </Link>

//                     {/* Navigation Links */}
//                     <div className="hidden md:flex items-center space-x-8">
//                         <Link href="/products" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Browse</Link>
//                         <Link href="/about" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">About</Link>
//                     </div>
//                 </div>

//                 {/* Right side - Desktop Menu */}
//                 <div className="hidden md:flex items-center space-x-6">
//                     <Link href="/" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Login</Link>
//                     <Link
//                         href="/"
//                         className="bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold 
//              hover:bg-[#27493a] transition-all duration-300 
//              shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//                     >
//                         Register
//                     </Link>


//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button
//                     className="md:hidden"
//                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 >
//                     ☰
//                 </button>
//             </div>

//             {/* Mobile Menu */}
//             {mobileMenuOpen && (
//                 <div className="md:hidden bg-white px-6 py-4 space-y-4">
//                     <Link href="/browse" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
//                         Browse
//                     </Link>
//                     <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
//                         About
//                     </Link>
//                     <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
//                         Login
//                     </Link>
//                     <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#27493a] transition-colors">
//                         Register
//                     </Link>
//                 </div>
//             )}
//         </nav>
//     );
// }


"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Heart } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
    const { isAuthenticated, user } = useAuth()

    return (
        <nav className=" bg-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image src="/NavbarLogo.webp" alt="DOMA" width={100} height={40} className="h-10 w-auto" />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                            Home
                        </Link>
                        <Link
                            href="/rooms"
                            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                        >
                            Rooms
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                        >
                            About
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <button className="text-foreground hover:text-foreground/80 transition-colors">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </button>
                        {(!isAuthenticated || user?.role === "customer") && (
                            <Link href="/wishlist" className="text-foreground hover:text-foreground/80 transition-colors">
                                <Heart className="h-5 w-5" />
                                <span className="sr-only">Wishlist</span>
                            </Link>
                        )}
                        {(!isAuthenticated || user?.role === "customer") && (
                            <Link href="/cart">
                                <button className="text-foreground hover:text-foreground/80 transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="sr-only">Cart</span>
                                </button></Link>
                        )}
                        {isAuthenticated ? (
                            <LogoutButton />
                        ) : (
                            <>
                                <Link href="/login" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Login</Link>
                                <Link
                                    href="/signup"
                                    className="bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold 
             hover:bg-[#27493a] transition-all duration-300 
             shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
