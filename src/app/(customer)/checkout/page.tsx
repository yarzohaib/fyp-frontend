'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    fetchCustomerProfile,
    processCheckout,
} from '@/lib/payload'
import type {
    CustomerProfile,
    CheckoutShippingAddress,
    CheckoutItem,
    Product,
} from '@/lib/Types'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

function SectionHeading({ n, label }: { n: number; label: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded-full bg-[#1A3126] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {n}
            </span>
            <h2 className="text-base font-semibold tracking-wide text-[#1A3126] uppercase">
                {label}
            </h2>
        </div>
    )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1A3126]/50 mb-1">
            {children}
        </label>
    )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full border-b border-gray-300 py-2.5 text-sm text-[#1A3126] placeholder:text-gray-300 focus:border-[#1A3126] outline-none bg-transparent transition-colors"
        />
    )
}

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [profile, setProfile] = useState<CustomerProfile | null>(null)
    const [cartItems, setCartItems] = useState<CheckoutItem[]>([])
    const [productImages, setProductImages] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [shippingAddress, setShippingAddress] = useState<CheckoutShippingAddress>({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        country: 'Pakistan',
        phone: '',
    })

    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'safepay'>('cod')

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }
        loadCheckoutData()
    }, [isAuthenticated, router])

    useEffect(() => {
        try {
            const map = JSON.parse(localStorage.getItem('doma_product_images') || '{}')
            setProductImages(map)
        } catch {}
    }, [cartItems])

    const loadCheckoutData = async () => {
        try {
            setLoading(true)
            setError(null)

            const itemsParam = searchParams.get('items')
            if (itemsParam) {
                try {
                    const decodedItems = JSON.parse(decodeURIComponent(escape(atob(itemsParam))))
                    setCartItems(decodedItems)
                } catch (e) {
                    console.error('Failed to decode cart items:', e)
                    setError('Failed to load cart items. Please try again.')
                    return
                }
            }

            const profileData = await fetchCustomerProfile()
            if (profileData) {
                setProfile(profileData)

                if (profileData.addresses && profileData.addresses.length > 0) {
                    const defaultAddress = profileData.addresses.find((a) => a.isDefault) || profileData.addresses[0]
                    const fullName = defaultAddress.firstName && defaultAddress.lastName
                        ? `${defaultAddress.firstName} ${defaultAddress.lastName}`
                        : profileData.Name || ''
                    const nameParts = fullName.trim().split(' ')

                    setShippingAddress({
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        street: defaultAddress.street || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || '',
                        country: 'Pakistan',
                        phone: defaultAddress.phone || profileData.phone || '',
                    })
                } else {
                    const nameParts = (profileData.Name || '').trim().split(' ')
                    setShippingAddress((prev) => ({
                        ...prev,
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        phone: profileData.phone || '',
                        country: 'Pakistan',
                    }))
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load checkout data')
        } finally {
            setLoading(false)
        }
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setShippingAddress((prev) => ({ ...prev, [name]: value }))
    }

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0)
        const shippingCost = subtotal > 1000 ? 0 : 100
        const tax = 0
        const total = subtotal + shippingCost + tax
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        }
    }

    const validate = (): string | null => {
        if (!shippingAddress.firstName?.trim()) return 'Please enter your first name'
        if (!shippingAddress.street?.trim()) return 'Please enter your street address'
        if (!shippingAddress.city?.trim()) return 'Please enter your city'
        if (!shippingAddress.phone?.trim()) return 'Please enter a phone number'
        if (cartItems.length === 0) return 'Your cart is empty. Please add items before checkout.'
        return null
    }

    const handleCodCheckout = async () => {
        const totals = calculateTotals()
        const itemsForBackend = cartItems.map((item) => ({
            product: String(typeof item.product === 'object' ? (item.product as Product)?.id : item.product),
            quantity: item.quantity,
            unitPrice: item.price || item.lineTotal / item.quantity || 0,
            lineTotal: item.lineTotal,
        }))

        const result = await processCheckout({
            items: itemsForBackend,
            shippingAddress: {
                firstName: shippingAddress.firstName?.trim() || 'Customer',
                lastName: shippingAddress.lastName?.trim() || '',
                street: shippingAddress.street?.trim() || '',
                city: shippingAddress.city?.trim() || '',
                state: shippingAddress.state?.trim() || '',
                country: 'Pakistan',
                phone: shippingAddress.phone?.trim() || '',
            },
            paymentMethod: 'cod',
            paymentStatus: 'pending',
            shippingCost: totals.shippingCost,
            tax: totals.tax,
        })

        if (result.success && result.order) {
            setSuccessMessage('Order placed successfully!')
            setTimeout(() => router.push('/products'), 1500)
        } else {
            setError(result.message || 'Failed to place order. Please try again.')
        }
    }

    const handleSafepayCheckout = async () => {
        const totals = calculateTotals()
        const token = typeof window !== 'undefined'
            ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
            : null

        if (!token) {
            setError('You must be logged in to checkout.')
            return
        }

        const itemsForBackend = cartItems.map((item) => ({
            product: String(typeof item.product === 'object' ? (item.product as Product)?.id : item.product),
            quantity: item.quantity,
            unitPrice: item.price || item.lineTotal / item.quantity || 0,
            lineTotal: item.lineTotal,
        }))

        const orderResult = await processCheckout({
            items: itemsForBackend,
            shippingAddress: {
                firstName: shippingAddress.firstName?.trim() || 'Customer',
                lastName: shippingAddress.lastName?.trim() || '',
                street: shippingAddress.street?.trim() || '',
                city: shippingAddress.city?.trim() || '',
                state: shippingAddress.state?.trim() || '',
                country: 'Pakistan',
                phone: shippingAddress.phone?.trim() || '',
            },
            paymentMethod: 'safepay',
            paymentStatus: 'pending',
            shippingCost: totals.shippingCost,
            tax: totals.tax,
        })

        if (!orderResult.success || !orderResult.order) {
            setError(orderResult.message || 'Failed to create order. Please try again.')
            return
        }

        const initiateResponse = await fetch(`${BASE_URL}/api/payments/safepay/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`,
            },
            body: JSON.stringify({
                amount: totals.total,
                currency: 'PKR',
                orderId: orderResult.order.id,
            }),
        })

        if (!initiateResponse.ok) {
            const err = await initiateResponse.json().catch(() => ({}))
            setError(err.error || 'Failed to initialize payment. Please try again.')
            return
        }

        const { checkoutUrl } = await initiateResponse.json()

        if (!checkoutUrl) {
            setError('No checkout URL returned from payment provider.')
            return
        }

        window.location.href = checkoutUrl
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setError(null)

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            setProcessing(false)
            return
        }

        try {
            if (paymentMethod === 'safepay') {
                await handleSafepayCheckout()
            } else {
                await handleCodCheckout()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process checkout')
        } finally {
            setProcessing(false)
        }
    }

    const totals = calculateTotals()

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#BB4E2C]" />
                    <p className="mt-4 text-sm text-[#1A3126]/60">Loading checkout...</p>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#1A3126] mb-3">Your cart is empty</h1>
                    <p className="text-sm text-[#1A3126]/60 mb-8">Please select items before checkout</p>
                    <Link href="/products" className="inline-block bg-[#BB4E2C] text-white text-sm font-semibold px-6 py-3 hover:bg-[#1A3126] transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16 px-4 sm:px-6 lg:px-8">

            {/* ── Success overlay ── */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl p-8 sm:p-12 max-w-md w-full mx-4">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-[#1A3126] mb-3">Order Placed!</h2>
                        <p className="text-center text-sm text-[#1A3126]/60 mb-6">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                        <div className="bg-gray-50 p-4 mb-8 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#1A3126]/60">Items</span>
                                <span className="font-semibold text-[#1A3126]">{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1A3126]/60">Total</span>
                                <span className="font-semibold text-[#BB4E2C]">Rs. {totals.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={() => router.push('/products')} className="w-full bg-[#BB4E2C] hover:bg-[#1A3126] text-white font-semibold py-3 transition-colors text-sm">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <Link href="/products" className="text-xs font-semibold text-[#BB4E2C] hover:text-[#1A3126] transition-colors tracking-wide uppercase">
                        ← Back to Products
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

                    {/* ── Left: form ── */}
                    <form onSubmit={handleCheckout} className="space-y-6">

                        {/* Section 1 — Shipping Information */}
                        <div className="bg-white border border-gray-100 p-6 sm:p-8">
                            <SectionHeading n={1} label="Shipping Information" />
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <FieldLabel>First Name *</FieldLabel>
                                        <TextInput type="text" name="firstName" value={shippingAddress.firstName} onChange={handleAddressChange} placeholder="John" required />
                                    </div>
                                    <div>
                                        <FieldLabel>Last Name</FieldLabel>
                                        <TextInput type="text" name="lastName" value={shippingAddress.lastName} onChange={handleAddressChange} placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <FieldLabel>Street Address *</FieldLabel>
                                    <TextInput type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} placeholder="123 Main Street" required />
                                </div>
                                <div>
                                    <FieldLabel>Area / Colony / Block</FieldLabel>
                                    <TextInput type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} placeholder="DHA Phase 5" />
                                </div>
                                <div>
                                    <FieldLabel>City *</FieldLabel>
                                    <TextInput type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} placeholder="Karachi" required />
                                </div>
                                <div>
                                    <FieldLabel>Phone Number *</FieldLabel>
                                    <TextInput type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} placeholder="+92 300 1234567" required />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 — Payment Method */}
                        <div className="bg-white border border-gray-100 p-6 sm:p-8">
                            <SectionHeading n={2} label="Payment Method" />
                            <div className="space-y-3">

                                <label className={`flex items-start p-4 border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-[#1A3126]' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="mt-0.5 accent-[#BB4E2C]" />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-[#1A3126]">Cash on Delivery (COD)</p>
                                        <p className="text-xs text-[#1A3126]/55 mt-0.5">Pay in cash when your order is delivered to your door.</p>
                                    </div>
                                </label>

                                <label className={`flex items-start p-4 border cursor-pointer transition ${paymentMethod === 'safepay' ? 'border-[#BB4E2C]' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="safepay"
                                        checked={paymentMethod === 'safepay'}
                                        onChange={() => setPaymentMethod('safepay')}
                                        className="mt-0.5 accent-[#BB4E2C]" />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-[#1A3126]">Pay Online</p>
                                            <div className="flex gap-1">
                                                <span className="text-[9px] font-bold bg-[#1A3126] text-white px-1.5 py-0.5">VISA</span>
                                                <span className="text-[9px] font-bold bg-[#BB4E2C] text-white px-1.5 py-0.5">MC</span>
                                                <span className="text-[9px] font-bold bg-emerald-700 text-white px-1.5 py-0.5">JCB</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#1A3126]/55 mt-0.5">Secure card &amp; wallet payment via Safepay. You will be redirected to complete payment.</p>
                                    </div>
                                </label>

                            </div>

                            {paymentMethod === 'safepay' && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 text-xs text-blue-700">
                                    After clicking &quot;Proceed to Payment&quot;, you&apos;ll be redirected to Safepay&apos;s secure checkout to enter your card details.
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing || cartItems.length === 0}
                            className="w-full bg-[#BB4E2C] hover:bg-[#1A3126] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 transition-colors text-sm tracking-wide uppercase"
                        >
                            {processing
                                ? (paymentMethod === 'safepay' ? 'Redirecting...' : 'Processing...')
                                : paymentMethod === 'safepay'
                                    ? `Proceed to Payment — Rs. ${totals.total.toLocaleString()}`
                                    : `Complete Purchase`
                            }
                        </button>

                    </form>

                    {/* ── Right: Order Summary ── */}
                    <div className="bg-white border border-gray-100 p-6 sticky top-8">
                        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[#1A3126] mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item, idx) => {
                                const productId = typeof item.product === 'object'
                                    ? (item.product as Product)?.id
                                    : String(item.product)
                                const imgSrc = productImages[productId]

                                return (
                                    <div key={idx} className="flex items-start gap-3">
                                        {/* Thumbnail */}
                                        <div className="w-14 h-14 shrink-0 bg-gray-50 relative overflow-hidden border border-gray-100">
                                            {imgSrc ? (
                                                <Image
                                                    src={imgSrc}
                                                    alt={item.productTitle || 'Product'}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="56px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#1A3126] line-clamp-2 leading-snug">
                                                {item.productTitle || 'Product'}
                                            </p>
                                            <p className="text-[11px] text-[#1A3126]/50 mt-0.5">Qty: {item.quantity}</p>
                                        </div>

                                        <p className="text-xs font-semibold text-[#1A3126] shrink-0">
                                            Rs. {item.lineTotal.toLocaleString()}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                            <div className="flex justify-between text-[#1A3126]/60">
                                <span>Subtotal</span>
                                <span>Rs. {totals.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[#1A3126]/60">
                                <span>Shipping</span>
                                <span className={totals.shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                                    {totals.shippingCost === 0 ? 'FREE' : `Rs. ${totals.shippingCost.toLocaleString()}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-[#BB4E2C] pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>Rs. {totals.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
