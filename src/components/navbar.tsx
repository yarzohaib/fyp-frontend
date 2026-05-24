"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useBackendCart } from "@/hooks/use-backend-cart";
import { useWishlist } from "@/hooks/use-wishlist";

const NAV_LINKS = [
    { href: "/",          label: "Home"     },
    { href: "/products",  label: "Products" },
    { href: "/redesign",  label: "Redesign" },
    { href: "/profile",   label: "Profile"  },
];

export default function Navbar() {
    const [scrollY, setScrollY]           = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname   = usePathname();
    const router     = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { cart }     = useBackendCart();
    const { wishlist } = useWishlist();

    const cartItemCount     = cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0;
    const wishlistItemCount = wishlist?.length ?? 0;

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const isScrolled    = scrollY > 50;
    // Transparent only over the home-page hero before any scrolling
    const isTransparent = pathname === "/" && !isScrolled;
    const logoSrc       = isTransparent ? "/WhiteLogo.png" : "/GreenLogo.png";

    const handleLogout = () => {
        logout();
        router.push("/");
        setMobileMenuOpen(false);
    };

    // Shared class helpers
    const iconCls  = `relative transition-colors duration-200 ${isTransparent ? "text-white/80 hover:text-white" : "text-[#1A3126]/60 hover:text-[#1A3126]"}`;
    const badge    = "absolute -top-1.5 -right-1.5 bg-[#BB4E2C] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none";

    return (
        <>
            {/* ── Desktop / Main nav ─────────────────────────────────────────── */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isTransparent
                    ? "bg-transparent"
                    : "bg-[#F2F0E5]/95 backdrop-blur-md border-b border-[#1A3126]/8 shadow-sm"
            }`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
                    <div className="flex items-center justify-between md:grid md:grid-cols-3 py-3 md:py-3.5">

                        {/* ── Left: Logo ─────────────────────────────────────── */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center group">
                                <Image
                                    src={logoSrc}
                                    alt="DOMA"
                                    width={160}
                                    height={56}
                                    className="h-11 w-auto transition-opacity duration-200 group-hover:opacity-75"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* ── Centre: Nav links (desktop) ────────────────────── */}
                        <div className="hidden md:flex items-center justify-center gap-7">
                            {NAV_LINKS.map(({ href, label }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
                                            active
                                                ? isTransparent ? "text-white"      : "text-[#1A3126]"
                                                : isTransparent ? "text-white/70 hover:text-white" : "text-[#1A3126]/60 hover:text-[#1A3126]"
                                        }`}
                                    >
                                        {label}
                                        {active && (
                                            <span className={`absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full ${
                                                isTransparent ? "bg-white" : "bg-[#BB4E2C]"
                                            }`} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ── Right: Icons + auth (desktop) ──────────────────── */}
                        <div className="hidden md:flex items-center justify-end gap-5">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
                                        <Heart className="h-[18px] w-[18px]" />
                                        {wishlistItemCount > 0 && (
                                            <span className={badge}>{wishlistItemCount > 9 ? "9+" : wishlistItemCount}</span>
                                        )}
                                    </Link>

                                    <Link href="/cart" className={iconCls} aria-label="Cart">
                                        <ShoppingCart className="h-[18px] w-[18px]" />
                                        {cartItemCount > 0 && (
                                            <span className={badge}>{cartItemCount > 9 ? "9+" : cartItemCount}</span>
                                        )}
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                                            isTransparent
                                                ? "text-white/70 hover:text-white"
                                                : "text-[#1A3126]/60 hover:text-[#BB4E2C]"
                                        }`}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className={`text-sm font-medium transition-colors duration-200 ${
                                            isTransparent
                                                ? "text-white/80 hover:text-white"
                                                : "text-[#1A3126]/70 hover:text-[#1A3126]"
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="bg-[#BB4E2C] text-white px-4 py-2 rounded-lg text-sm font-semibold
                                                   hover:bg-orange-500 transition-all duration-200
                                                   shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* ── Right: Icons + burger (mobile) ─────────────────── */}
                        <div className="md:hidden flex items-center justify-end gap-3.5">
                            {isAuthenticated && (
                                <>
                                    <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
                                        <Heart className="h-5 w-5" />
                                        {wishlistItemCount > 0 && (
                                            <span className={badge}>{wishlistItemCount > 9 ? "9+" : wishlistItemCount}</span>
                                        )}
                                    </Link>
                                    <Link href="/cart" className={iconCls} aria-label="Cart">
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartItemCount > 0 && (
                                            <span className={badge}>{cartItemCount > 9 ? "9+" : cartItemCount}</span>
                                        )}
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                                className={`p-1 transition-colors ${isTransparent ? "text-white/80 hover:text-white" : "text-[#1A3126]/70 hover:text-[#1A3126]"}`}
                            >
                                {mobileMenuOpen
                                    ? <X className="w-5 h-5" />
                                    : <Menu className="w-5 h-5" />
                                }
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

            {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ── Mobile drawer ───────────────────────────────────────────────── */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-[#F2F0E5] z-50 flex flex-col shadow-2xl
                             transform transition-transform duration-300 ease-in-out md:hidden ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
                {/* Header */}
                <div className="bg-[#1A3126] px-6 py-5 flex items-center justify-between shrink-0">
                    <Image src="/WhiteLogo.png" alt="DOMA" width={100} height={32} className="h-7 w-auto" />
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Links */}
                <nav className="flex flex-col px-4 pt-5 gap-1 flex-1 overflow-y-auto">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-[#1A3126] text-[#F2F0E5]"
                                        : "text-[#1A3126] hover:bg-[#1A3126]/8"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth */}
                <div className="px-4 pb-8 pt-4 border-t border-[#1A3126]/10 shrink-0">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                       border-2 border-[#BB4E2C] text-[#BB4E2C] text-sm font-semibold
                                       hover:bg-[#BB4E2C] hover:text-white transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-3 rounded-xl border-2 border-[#1A3126]
                                           text-[#1A3126] text-sm font-semibold
                                           hover:bg-[#1A3126] hover:text-[#F2F0E5] transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-3 rounded-xl bg-[#BB4E2C]
                                           text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
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
