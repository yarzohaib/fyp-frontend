"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, Heart } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/contexts/auth-context";
import { useBackendCart } from "@/hooks/use-backend-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { cart } = useBackendCart();
    const { wishlist } = useWishlist();

    // Calculate total items in cart
    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const wishlistItemCount = wishlist?.length || 0;

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
                        ? "bg-[#F2F0E5] backdrop-blur-sm shadow-md" 
                        : "bg-linear-to-b from-black/40 to-transparent"
                }`}
            >
                <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
                    <div className="flex items-center justify-between py-4">
                        {/* Left side - Logo and Navigation Links */}
                        <div className="flex items-center space-x-8 lg:space-x-12">
                            {/* Logo */}
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logoo.jpg"
                                    alt="Doma Logo"
                                    width={80}
                                    height={80}
                                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform hover:scale-105 object-contain"
                                    priority
                                    sizes="(max-width: 640px) 40px, 48px" 
                                />
                            </Link>

                            {/* Navigation Links - Desktop */}
                            <div className="hidden md:flex items-center space-x-8">
                                <Link 
                                    href="/profile" 
                                    className={`transition-colors font-medium ${
                                        isScrolled 
                                            ? "text-gray-700 hover:text-[#1a3126]" 
                                            : "text-white hover:text-white/80"
                                    }`}
                                >
                                    Profile
                                </Link>
                                <Link 
                                    href="/products" 
                                    className={`transition-colors font-medium ${
                                        isScrolled 
                                            ? "text-gray-700 hover:text-[#1a3126]" 
                                            : "text-white hover:text-white/80"
                                    }`}
                                >
                                    Products
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
                                        className={`relative transition-colors ${
                                            isScrolled 
                                                ? "text-gray-700 hover:text-[#1a3126]" 
                                                : "text-white hover:text-white/80"
                                        }`}
                                    >
                                        <Heart className="h-5 w-5" />
                                        {wishlistItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                            </span>
                                        )}
                                        <span className="sr-only">Wishlist</span>
                                    </Link>

                                    {/* Cart with Badge */}
                                    <Link 
                                        href="/cart"
                                        className={`relative transition-colors ${
                                            isScrolled 
                                                ? "text-gray-700 hover:text-[#1a3126]" 
                                                : "text-white hover:text-white/80"
                                        }`}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartItemCount > 99 ? '99+' : cartItemCount}
                                            </span>
                                        )}
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
                                        className="bg-[#BB4E2C] text-white px-5 py-2.5 rounded-lg font-semibold 
                                                 hover:bg-orange-500 transition-all duration-300 
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
                className={`fixed top-0 right-0 h-full w-72 bg-[#F2F0E5] z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="bg-[#1A3126] px-6 py-5 flex items-center justify-between shrink-0">
                    <span className="text-[#F2F0E5] font-serif text-2xl tracking-widest font-medium">
                        DOMA
                    </span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[#F2F0E5]/60 hover:text-[#F2F0E5] transition-colors p-1 rounded-lg hover:bg-white/10"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col px-6 pt-6 gap-1 flex-1">
                    <Link
                        href="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1A3126] font-medium hover:bg-[#1A3126]/8 transition-colors"
                    >
                        Products
                    </Link>
                    <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1A3126] font-medium hover:bg-[#1A3126]/8 transition-colors"
                    >
                        Profile
                    </Link>

                    {isAuthenticated && (
                        <>
                            <div className="h-px bg-[#1A3126]/10 my-3" />
                            <Link
                                href="/wishlist"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-3 rounded-xl text-[#1A3126] font-medium hover:bg-[#1A3126]/8 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <Heart className="h-4 w-4 text-[#BB4E2C]" />
                                    Wishlist
                                </span>
                                {wishlistItemCount > 0 && (
                                    <span className="bg-[#BB4E2C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-3 rounded-xl text-[#1A3126] font-medium hover:bg-[#1A3126]/8 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <ShoppingCart className="h-4 w-4 text-[#BB4E2C]" />
                                    Cart
                                </span>
                                {cartItemCount > 0 && (
                                    <span className="bg-[#BB4E2C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                </div>

                {/* Auth Section */}
                <div className="px-6 pb-8 pt-4 border-t border-[#1A3126]/10 shrink-0">
                    {isAuthenticated ? (
                        <LogoutButton />
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-3 rounded-xl border-2 border-[#1A3126] text-[#1A3126] font-semibold hover:bg-[#1A3126] hover:text-[#F2F0E5] transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-3 rounded-xl bg-[#BB4E2C] text-white font-semibold hover:bg-orange-500 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}