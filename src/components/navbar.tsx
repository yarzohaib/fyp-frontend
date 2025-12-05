
// // "use client";

// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import Image from "next/image";

// // export default function Navbar() {
// //     const [scrollY, setScrollY] = useState(0);
// //     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //     useEffect(() => {
// //         const handleScroll = () => setScrollY(window.scrollY);
// //         window.addEventListener("scroll", handleScroll);
// //         return () => window.removeEventListener("scroll", handleScroll);
// //     }, []);

// //     return (
// //         <nav
// //             className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white shadow-md" : "bg-transparent"
// //                 }`}
// //         >
// //             <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
// //                 {/* Left side - Logo and Navigation Links */}
// //                 <div className="flex items-center space-x-8">
// //                     {/* Logo */}
// //                     <Link href="/" className="flex items-center">
// //                         <Image
// //                             src="/NavbarLogo.webp"
// //                             alt="Doma Logo"
// //                             width={400}
// //                             height={118}
// //                             className="w-12 h-12"
// //                         />
// //                     </Link>

// //                     {/* Navigation Links */}
// //                     <div className="hidden md:flex items-center space-x-8">
// //                         <Link href="/products" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Browse</Link>
// //                         <Link href="/about" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">About</Link>
// //                     </div>
// //                 </div>

// //                 {/* Right side - Desktop Menu */}
// //                 <div className="hidden md:flex items-center space-x-6">
// //                     <Link href="/login" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Login</Link>
// //                     <Link
// //                         href="/signup"
// //                         className="bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold 
// //              hover:bg-[#27493a] transition-all duration-300 
// //              shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
// //                     >
// //                         Signup
// //                     </Link>


// //                 </div>

// //                 {/* Mobile Menu Button */}
// //                 <button
// //                     className="md:hidden"
// //                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //                 >
// //                     ☰
// //                 </button>
// //             </div>

// //             {/* Mobile Menu */}
// //             {mobileMenuOpen && (
// //                 <div className="md:hidden bg-white px-6 py-4 space-y-4">
// //                     <Link href="/browse" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
// //                         Browse
// //                     </Link>
// //                     <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
// //                         About
// //                     </Link>
// //                     <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 hover:text-[#1a3126] transition-colors font-medium">
// //                         Login
// //                     </Link>
// //                     <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#27493a] transition-colors">
// //                         Register
// //                     </Link>
// //                 </div>
// //             )}
// //         </nav>
// //     );
// // }



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X } from "lucide-react";

// export default function Navbar() {
//     const [scrollY, setScrollY] = useState(0);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => setScrollY(window.scrollY);
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     // Lock body scroll when mobile menu is open
//     useEffect(() => {
//         if (mobileMenuOpen) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "unset";
//         }
//         return () => {
//             document.body.style.overflow = "unset";
//         };
//     }, [mobileMenuOpen]);

//     const isScrolled = scrollY > 50;

//     return (
//         <>
//             <nav
//                 className={`fixed w-full z-50 transition-all duration-300 ${
//                     isScrolled 
//                         ? "bg-white/95 backdrop-blur-sm shadow-md" 
//                         : "bg-gradient-to-b from-black/40 to-transparent"
//                 }`}
//             >
//                 <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
//                     <div className="flex items-center justify-between py-4">
//                         {/* Left side - Logo and Navigation Links */}
//                         <div className="flex items-center space-x-8 lg:space-x-12">
//                             {/* Logo */}
//                             <Link href="/" className="flex items-center">
//                                 <Image
//                                     src="/NavbarLogo.webp"
//                                     alt="Doma Logo"
//                                     width={48}
//                                     height={48}
//                                     className="w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105"
//                                 />
//                             </Link>

//                             {/* Navigation Links - Desktop */}
//                             <div className="hidden md:flex items-center space-x-8">
//                                 <Link 
//                                     href="/products" 
//                                     className={`transition-colors font-medium ${
//                                         isScrolled 
//                                             ? "text-gray-700 hover:text-[#1a3126]" 
//                                             : "text-white hover:text-white/80"
//                                     }`}
//                                 >
//                                     Browse
//                                 </Link>
//                                 <Link 
//                                     href="/about" 
//                                     className={`transition-colors font-medium ${
//                                         isScrolled 
//                                             ? "text-gray-700 hover:text-[#1a3126]" 
//                                             : "text-white hover:text-white/80"
//                                     }`}
//                                 >
//                                     About
//                                 </Link>
//                             </div>
//                         </div>

//                         {/* Right side - Desktop Menu */}
//                         <div className="hidden md:flex items-center space-x-6">
//                             <Link 
//                                 href="/login" 
//                                 className={`transition-colors font-medium ${
//                                     isScrolled 
//                                         ? "text-gray-700 hover:text-[#1a3126]" 
//                                         : "text-white hover:text-white/80"
//                                 }`}
//                             >
//                                 Login
//                             </Link>
//                             <Link
//                                 href="/signup"
//                                 className="bg-[#1a3126] text-white px-5 py-2.5 rounded-lg font-semibold 
//                                          hover:bg-[#27493a] transition-all duration-300 
//                                          shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//                             >
//                                 Sign Up
//                             </Link>
//                         </div>

//                         {/* Mobile Menu Button */}
//                         <button
//                             className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
//                             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                             aria-label="Toggle menu"
//                         >
//                             {mobileMenuOpen ? (
//                                 <X className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
//                             ) : (
//                                 <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </nav>

//             {/* Mobile Menu Overlay */}
//             {mobileMenuOpen && (
//                 <div 
//                     className="fixed inset-0 bg-black/50 z-40 md:hidden"
//                     onClick={() => setMobileMenuOpen(false)}
//                 />
//             )}

//             {/* Mobile Menu Drawer */}
//             <div
//                 className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
//                     mobileMenuOpen ? "translate-x-0" : "translate-x-full"
//                 }`}
//             >
//                 <div className="flex flex-col h-full">
//                     {/* Mobile Menu Header */}
//                     <div className="flex items-center justify-between p-6 border-b">
//                         <Image
//                             src="/NavbarLogo.webp"
//                             alt="Doma Logo"
//                             width={40}
//                             height={40}
//                             className="w-10 h-10"
//                         />
//                         <button
//                             onClick={() => setMobileMenuOpen(false)}
//                             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                             aria-label="Close menu"
//                         >
//                             <X className="w-6 h-6 text-gray-700" />
//                         </button>
//                     </div>

//                     {/* Mobile Menu Links */}
//                     <div className="flex flex-col p-6 space-y-4 flex-1">
//                         <Link 
//                             href="/products" 
//                             onClick={() => setMobileMenuOpen(false)} 
//                             className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
//                         >
//                             Browse
//                         </Link>
//                         <Link 
//                             href="/about" 
//                             onClick={() => setMobileMenuOpen(false)} 
//                             className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
//                         >
//                             About
//                         </Link>
//                         <Link 
//                             href="/login" 
//                             onClick={() => setMobileMenuOpen(false)} 
//                             className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
//                         >
//                             Login
//                         </Link>
//                         <Link 
//                             href="/signup" 
//                             onClick={() => setMobileMenuOpen(false)} 
//                             className="bg-[#1a3126] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#27493a] transition-colors text-center mt-2"
//                         >
//                             Sign Up
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }



// // "use client"

// // import Link from "next/link"
// // import Image from "next/image"
// // import { Search, ShoppingCart, Heart } from "lucide-react"
// // import { LogoutButton } from "@/components/logout-button"
// // import { useAuth } from "@/contexts/auth-context"

// // export function Navbar() {
// //     const { isAuthenticated, user } = useAuth()

// //     return (
// //         <nav className=" bg-transparent">
// //             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //                 <div className="flex h-16 items-center justify-between">
// //                     {/* Logo */}
// //                     <Link href="/" className="flex-shrink-0">
// //                         <Image src="/NavbarLogo.webp" alt="DOMA" width={100} height={40} className="h-10 w-auto" />
// //                     </Link>

// //                     {/* Navigation Links */}
// //                     <div className="hidden md:flex items-center gap-8">
// //                         <Link href="/" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
// //                             Home
// //                         </Link>
// //                         <Link
// //                             href="/rooms"
// //                             className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
// //                         >
// //                             Rooms
// //                         </Link>
// //                         <Link
// //                             href="/about"
// //                             className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
// //                         >
// //                             About
// //                         </Link>
// //                     </div>

// //                     {/* Right Side Actions */}
// //                     <div className="flex items-center gap-4">
// //                         <button className="text-foreground hover:text-foreground/80 transition-colors">
// //                             <Search className="h-5 w-5" />
// //                             <span className="sr-only">Search</span>
// //                         </button>
// //                         {(!isAuthenticated || user?.role === "customer") && (
// //                             <Link href="/wishlist" className="text-foreground hover:text-foreground/80 transition-colors">
// //                                 <Heart className="h-5 w-5" />
// //                                 <span className="sr-only">Wishlist</span>
// //                             </Link>
// //                         )}
// //                         {(!isAuthenticated || user?.role === "customer") && (
// //                             <Link href="/cart">
// //                                 <button className="text-foreground hover:text-foreground/80 transition-colors">
// //                                     <ShoppingCart className="h-5 w-5" />
// //                                     <span className="sr-only">Cart</span>
// //                                 </button></Link>
// //                         )}
// //                         {isAuthenticated ? (
// //                             <LogoutButton />
// //                         ) : (
// //                             <>
// //                                 <Link href="/login" className="text-[#F2F0E5] hover:text-[#1a3126] transition-colors font-medium">Login</Link>
// //                                 <Link
// //                                     href="/signup"
// //                                     className="bg-[#1a3126] text-white px-4 py-2 rounded-lg font-semibold 
// //              hover:bg-[#27493a] transition-all duration-300 
// //              shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
// //                                 >
// //                                     Signup
// //                                 </Link>
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </nav>
// //     )
// // }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingCart, Heart } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/contexts/auth-context";

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const isScrolled = scrollY > 50;

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${
                    isScrolled 
                        ? "bg-white/95 backdrop-blur-sm shadow-md" 
                        : "bg-gradient-to-b from-black/40 to-transparent"
                }`}
            >
                <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
                    <div className="flex items-center justify-between py-4">
                        {/* Left side - Logo and Navigation Links */}
                        <div className="flex items-center space-x-8 lg:space-x-12">
                            {/* Logo */}
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/NavbarLogo.webp"
                                    alt="Doma Logo"
                                    width={48}
                                    height={48}
                                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105"
                                />
                            </Link>

                            {/* Navigation Links - Desktop */}
                            <div className="hidden md:flex items-center space-x-8">
                                <Link 
                                    href="/products" 
                                    className={`transition-colors font-medium ${
                                        isScrolled 
                                            ? "text-gray-700 hover:text-[#1a3126]" 
                                            : "text-white hover:text-white/80"
                                    }`}
                                >
                                    Browse
                                </Link>
                                <Link 
                                    href="/about" 
                                    className={`transition-colors font-medium ${
                                        isScrolled 
                                            ? "text-gray-700 hover:text-[#1a3126]" 
                                            : "text-white hover:text-white/80"
                                    }`}
                                >
                                    About
                                </Link>
                            </div>
                        </div>

                        {/* Right side - Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            
                            {isAuthenticated ? (
                                <>
                                    {/* Wishlist - Show for authenticated users */}
                                    <Link 
                                        href="/wishlist" 
                                        className={`transition-colors ${
                                            isScrolled 
                                                ? "text-gray-700 hover:text-[#1a3126]" 
                                                : "text-white hover:text-white/80"
                                        }`}
                                    >
                                        <Heart className="h-5 w-5" />
                                        <span className="sr-only">Wishlist</span>
                                    </Link>

                                    {/* Cart - Show for authenticated users */}
                                    <Link 
                                        href="/cart"
                                        className={`transition-colors ${
                                            isScrolled 
                                                ? "text-gray-700 hover:text-[#1a3126]" 
                                                : "text-white hover:text-white/80"
                                        }`}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="sr-only">Cart</span>
                                    </Link>

                                    {/* Logout Button */}
                                    <LogoutButton />
                                </>
                            ) : (
                                <>
                                    {/* Login & Signup - Show for unauthenticated users */}
                                    <Link 
                                        href="/login" 
                                        className={`transition-colors font-medium ${
                                            isScrolled 
                                                ? "text-gray-700 hover:text-[#1a3126]" 
                                                : "text-white hover:text-white/80"
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="bg-[#1a3126] text-white px-5 py-2.5 rounded-lg font-semibold 
                                                 hover:bg-[#27493a] transition-all duration-300 
                                                 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
                            ) : (
                                <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <Image
                            src="/NavbarLogo.webp"
                            alt="Doma Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex flex-col p-6 space-y-4 flex-1">
                        <Link 
                            href="/products" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
                        >
                            Browse
                        </Link>
                        <Link 
                            href="/about" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
                        >
                            About
                        </Link>

                        {/* Mobile Icons */}
                        <div className="flex items-center gap-4 py-2 border-t border-b">
                            <button className="text-gray-700 hover:text-[#1a3126] transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                            {isAuthenticated && (
                                <>
                                    <Link 
                                        href="/wishlist" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-700 hover:text-[#1a3126] transition-colors"
                                    >
                                        <Heart className="h-5 w-5" />
                                    </Link>
                                    <Link 
                                        href="/cart"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-700 hover:text-[#1a3126] transition-colors"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="mt-auto">
                                <LogoutButton />
                            </div>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="text-gray-700 hover:text-[#1a3126] transition-colors font-medium py-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/signup" 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="bg-[#1a3126] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#27493a] transition-colors text-center mt-2"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}