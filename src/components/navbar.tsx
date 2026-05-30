"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart, LogOut, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useWishlist } from "@/hooks/use-wishlist";
import { AnnouncementBar } from "./announcement-bar";
import { CartDrawer } from "./cart-drawer";

const NAV_LINKS = [
    { href: "/",         label: "Home"     },
    { href: "/products", label: "Products" },
    { href: "/redesign", label: "Redesign" },
    { href: "/profile",  label: "Profile"  },
];

// must match h-9 (36px) in AnnouncementBar
const BAR_H = 36;

export default function Navbar() {
    const [scrollY, setScrollY]               = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router   = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const { wishlist } = useWishlist();

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

    // Announcement bar slides away once user scrolls past its height
    const barVisible    = scrollY < BAR_H;
    const isScrolled    = scrollY > 50;
    // Transparent / floating-card state: only on the homepage before scrolling
    const isTransparent = pathname === "/" && !isScrolled;

    const handleLogout = () => {
        logout();
        router.push("/");
        setMobileMenuOpen(false);
    };

    // Both states are dark → text always white
    const iconCls = "relative transition-colors duration-200 text-white/80 hover:text-white";
    const badge   = "absolute -top-1.5 -right-1.5 bg-[#BB4E2C] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none";

    return (
        <>
            {/* ── Announcement bar — slides up when scrolled ─────────────────── */}
            <div className={`fixed top-0 w-full z-[51] transition-transform duration-300 ${
                barVisible ? "translate-y-0" : "-translate-y-full"
            }`}>
                <AnnouncementBar />
            </div>

            {/* ── Navbar wrapper — drops to top-0 once bar is gone ───────────── */}
            <div className={`fixed w-full z-50 transition-all duration-300 ${
                barVisible ? "top-9" : "top-0"
            }`}>
                <nav className={`transition-all duration-300 mx-3 md:mx-8 lg:mx-14 mt-2 border border-white/10 shadow-xl shadow-black/25 ${
                    isTransparent
                        ? "bg-[#1A3126]/80 backdrop-blur-md"
                        : "bg-[#1A3126]"
                }`}>
                    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
                        <div className="flex items-center justify-between md:grid md:grid-cols-3 py-2 md:py-2.5">

                            {/* ── Left: Logo ─────────────────────────────────── */}
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center group">
                                    <Image
                                        src="/WhiteLogo.png"
                                        alt="DOMA"
                                        width={160}
                                        height={56}
                                        className="h-8 md:h-9 w-auto transition-opacity duration-200 group-hover:opacity-75"
                                        priority
                                    />
                                </Link>
                            </div>

                            {/* ── Centre: Nav links (desktop) ────────────────── */}
                            <div className="hidden md:flex items-center justify-center gap-8">
                                {NAV_LINKS.map(({ href, label }) => {
                                    const active = pathname === href;
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className={`relative text-sm font-medium tracking-wide transition-colors duration-200 pb-0.5 ${
                                                active ? "text-white" : "text-white/65 hover:text-white"
                                            }`}
                                        >
                                            {label}
                                            {active && (
                                                <span className={`absolute -bottom-0.5 left-0 right-0 h-[1.5px] ${
                                                    isTransparent ? "bg-white" : "bg-[#BB4E2C]"
                                                }`} />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* ── Right: Icons + auth (desktop) ──────────────── */}
                            <div className="hidden md:flex items-center justify-end gap-5">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
                                            <Heart className="h-[18px] w-[18px]" />
                                            {wishlistItemCount > 0 && (
                                                <span className={badge}>{wishlistItemCount > 9 ? "9+" : wishlistItemCount}</span>
                                            )}
                                        </Link>

                                        <CartDrawer
                                            triggerClassName={iconCls}
                                            badgeClassName={badge}
                                            iconSize="h-[18px] w-[18px]"
                                        />

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-1.5 text-sm font-medium text-white/65 hover:text-white transition-colors duration-200"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200">
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="bg-[#BB4E2C] text-white px-5 py-2 text-sm font-semibold
                                                       hover:bg-orange-500 transition-all duration-200
                                                       shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* ── Right: Icons + burger (mobile) ─────────────── */}
                            <div className="md:hidden flex items-center justify-end gap-3.5">
                                {isAuthenticated && (
                                    <>
                                        <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
                                            <Heart className="h-5 w-5" />
                                            {wishlistItemCount > 0 && (
                                                <span className={badge}>{wishlistItemCount > 9 ? "9+" : wishlistItemCount}</span>
                                            )}
                                        </Link>
                                        <CartDrawer
                                            triggerClassName={iconCls}
                                            badgeClassName={badge}
                                            iconSize="h-5 w-5"
                                        />
                                    </>
                                )}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    aria-label="Toggle menu"
                                    className="p-1 text-white/80 hover:text-white transition-colors"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>

            {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ── Mobile drawer ───────────────────────────────────────────────── */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-[#1A3126] z-[60] flex flex-col shadow-2xl
                             transform transition-transform duration-300 ease-in-out md:hidden ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
                <div className="bg-[#0f1f16] px-6 py-5 flex items-center justify-between shrink-0">
                    <Image src="/WhiteLogo.png" alt="DOMA" width={90} height={28} className="h-6 w-auto" />
                    <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="text-white/60 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex flex-col px-4 pt-5 gap-1 flex-1 overflow-y-auto">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-3 text-sm font-medium transition-colors border-b border-white/8 ${
                                    active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/8 hover:text-white"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    <Link
                        href="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-white/65 hover:bg-white/8 hover:text-white transition-colors border-b border-white/8 flex items-center gap-2"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </Link>
                </nav>

                <div className="px-4 pb-8 pt-4 border-t border-white/10 shrink-0">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3
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
                                className="w-full text-center py-3 border-2 border-white/30
                                           text-white text-sm font-semibold hover:bg-white/10 transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center py-3 bg-[#BB4E2C] text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
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
