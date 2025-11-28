'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Trash2 } from 'lucide-react'
//import { Navbar2 } from '@/components/navbar2'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useWishlist, WishlistItem } from '@/hooks/use-wishlist'
import Image from 'next/image'
import Navbar2 from '@/components/navbar2'

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar2 />

            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Breadcrumb */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-8 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
                    <p className="text-foreground/70">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {/* Empty State */}
                {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-16 w-16 text-foreground/30"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
                        <p className="text-foreground/70 mb-8">Start adding your favorite items!</p>
                        <Link href="/">
                            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item: WishlistItem) => (
                            <div
                                key={item.id}
                                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Image */}
                                <Link
                                    href={item.slug ? `/products/${item.slug}` : `/products/${item.id}`}
                                    className="block relative aspect-square overflow-hidden bg-secondary/20"
                                >
                                    <Image
                                        src={item.image || '/placeholder.svg'}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>

                                {/* Content */}
                                <div className="p-4">
                                    <Link
                                        href={item.slug ? `/products/${item.slug}` : `/products/${item.id}`}
                                        className="block mb-2"
                                    >
                                        <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors text-balance">
                                            {item.name}
                                        </h3>
                                    </Link>

                                    <p className="text-base font-semibold text-accent mb-4">${item.price}</p>

                                    <div className="flex gap-2">
                                        <Link
                                            href={item.slug ? `/products/${item.slug}` : `/products/${item.id}`}
                                            className="flex-1"
                                        >
                                            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                                                View Product
                                            </Button>
                                        </Link>

                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="p-2 border border-border rounded-full text-foreground hover:bg-destructive hover:border-destructive hover:text-background transition-all"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                            <span className="sr-only">Remove from wishlist</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
