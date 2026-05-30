'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Trash2, ShoppingBag, X } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useBackendCart } from '@/hooks/use-backend-cart'

interface CartDrawerProps {
    /** Extra classes for the trigger button (matches navbar icon style) */
    triggerClassName?: string
    /** Badge classes from navbar */
    badgeClassName?: string
    /** Icon size class e.g. "h-[18px] w-[18px]" */
    iconSize?: string
}

export function CartDrawer({
    triggerClassName = 'relative transition-colors duration-200 text-white/80 hover:text-white',
    badgeClassName = 'absolute -top-1.5 -right-1.5 bg-[#BB4E2C] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none',
    iconSize = 'h-[18px] w-[18px]',
}: CartDrawerProps) {
    const { cart, removeFromCart, updateQuantity, clearCart, loading } = useBackendCart()

    const [productImages, setProductImages] = useState<Record<string, string>>({})

    useEffect(() => {
        try {
            const map = JSON.parse(localStorage.getItem('doma_product_images') || '{}')
            setProductImages(map)
        } catch {}
    }, [cart])

    const itemCount = cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0
    const subtotal = cart?.subtotal ?? 0
    const total = cart?.total ?? 0

    const allItemsEncoded = () => {
        if (!cart?.items) return ''
        return btoa(unescape(encodeURIComponent(JSON.stringify(cart.items))))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className={triggerClassName} aria-label="Cart">
                    <ShoppingCart className={iconSize} />
                    {itemCount > 0 && (
                        <span className={badgeClassName}>
                            {itemCount > 9 ? '9+' : itemCount}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-105 p-0 flex flex-col [&>button:first-child]:hidden"
            >
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                    <div>
                        <SheetTitle className="text-lg font-semibold text-[#1A3126]">Your Cart</SheetTitle>
                        {itemCount > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                {itemCount} item{itemCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    <SheetClose asChild>
                        <button
                            className="text-gray-400 hover:text-[#1A3126] transition-colors p-1"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </SheetClose>
                </div>

                {/* ── Empty state ─────────────────────────────────────── */}
                {(!cart || cart.items.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                        <ShoppingBag className="w-16 h-16 text-gray-200" />
                        <p className="text-sm font-medium text-gray-400">Your cart is empty</p>
                        <SheetClose asChild>
                            <Link
                                href="/products"
                                className="text-xs font-semibold text-[#BB4E2C] border border-[#BB4E2C]/30 px-5 py-2 hover:bg-[#BB4E2C] hover:text-white transition-colors"
                            >
                                Browse Products
                            </Link>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        {/* ── Items ────────────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 px-6">
                            {cart.items.map((item, idx) => {
                                const productId =
                                    typeof item.product === 'string'
                                        ? item.product
                                        : item.product.id
                                const productTitle =
                                    typeof item.product === 'string'
                                        ? 'Product'
                                        : item.product.title

                                return (
                                    <div
                                        key={`${productId}-${idx}`}
                                        className="flex items-start gap-3 py-4"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-18 h-18 shrink-0 bg-gray-100 relative overflow-hidden">
                                            {productImages[productId] ? (
                                                <Image
                                                    src={productImages[productId]}
                                                    alt={productTitle}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="72px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#1A3126] line-clamp-2 leading-snug">
                                                {productTitle}
                                            </p>
                                            <p className="text-sm font-bold text-[#BB4E2C] mt-0.5">
                                                Rs. {item.unitPrice.toLocaleString()}
                                            </p>

                                            {/* Qty controls */}
                                            <div className="inline-flex items-center mt-2 border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                                                    disabled={loading}
                                                    className="w-8 h-8 flex items-center justify-center text-[#1A3126] hover:bg-gray-100 transition-colors text-base disabled:opacity-40"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#1A3126] border-x border-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                                                    disabled={loading}
                                                    className="w-8 h-8 flex items-center justify-center text-[#1A3126] hover:bg-gray-100 transition-colors text-base disabled:opacity-40"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => removeFromCart(productId)}
                                            disabled={loading}
                                            className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 p-1 mt-1 shrink-0"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── Footer ───────────────────────────────────── */}
                        <div className="border-t border-gray-100 px-6 pt-4 pb-6 space-y-4 shrink-0">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-[#1A3126]">
                                    Rs. {subtotal.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-[#1A3126]">
                                <span>Total</span>
                                <span>Rs. {total.toLocaleString()}</span>
                            </div>

                            <SheetClose asChild>
                                <Link
                                    href={`/checkout?items=${allItemsEncoded()}`}
                                    className="block w-full bg-[#1A3126] text-white text-sm font-semibold text-center py-3.5 hover:bg-[#0f1f16] transition-colors"
                                >
                                    Continue to Checkout
                                </Link>
                            </SheetClose>

                            <button
                                onClick={() => clearCart()}
                                disabled={loading}
                                className="w-full bg-red-50 text-red-500 text-sm font-semibold py-3 hover:bg-red-100 transition-colors disabled:opacity-40"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
