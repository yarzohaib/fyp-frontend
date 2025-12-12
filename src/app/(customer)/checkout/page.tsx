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

export default function CheckoutPage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    // State management
    const [profile, setProfile] = useState<CustomerProfile | null>(null)
    const [cartItems, setCartItems] = useState<CheckoutItem[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Checkout form state
    const [shippingAddress, setShippingAddress] = useState<CheckoutShippingAddress>({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        country: 'Pakistan',
        phone: '',
    })

    const [paymentMethod, setPaymentMethod] = useState('cod')

    // Load initial data
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        loadCheckoutData()
    }, [isAuthenticated, router])

    const loadCheckoutData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Get selected items from URL params
            const itemsParam = searchParams.get('items')
            if (itemsParam) {
                try {
                    const decodedItems = JSON.parse(atob(itemsParam))
                    setCartItems(decodedItems)
                } catch (e) {
                    console.error('Failed to decode cart items:', e)
                    setError('Failed to load cart items. Please try again.')
                    return
                }
            }

            // Fetch customer profile
            const profileData = await fetchCustomerProfile()
            if (profileData) {
                setProfile(profileData)

                // Auto-fill shipping address from profile
                if (profileData.addresses && profileData.addresses.length > 0) {
                    const defaultAddress = profileData.addresses.find((a) => a.isDefault) || profileData.addresses[0]
                    
                    // Split the name properly
                    const fullName = defaultAddress.firstName && defaultAddress.lastName 
                        ? `${defaultAddress.firstName} ${defaultAddress.lastName}` 
                        : profileData.Name || ''
                    
                    const nameParts = fullName.trim().split(' ')
                    const firstName = nameParts[0] || ''
                    const lastName = nameParts.slice(1).join(' ') || ''
                    
                    setShippingAddress({
                        firstName: firstName,
                        lastName: lastName,
                        street: defaultAddress.street || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || '',
                        country: 'Pakistan',
                        phone: defaultAddress.phone || profileData.phone || '',
                    })
                } else {
                    // Fallback to profile name and phone
                    const nameParts = (profileData.Name || '').trim().split(' ')
                    const firstName = nameParts[0] || ''
                    const lastName = nameParts.slice(1).join(' ') || ''
                    
                    setShippingAddress((prev) => ({
                        ...prev,
                        firstName: firstName,
                        lastName: lastName,
                        phone: profileData.phone || '',
                        country: 'Pakistan',
                    }))
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load checkout data'
            setError(errorMessage)
            console.error('Error loading checkout data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0)
        const shippingCost = subtotal > 1000 ? 0 : 100
        const tax = 0 // No tax for now
        const total = subtotal + shippingCost + tax

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        }
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setError(null)

        // Validation
        if (!shippingAddress.firstName?.trim()) {
            setError('Please enter your first name')
            setProcessing(false)
            return
        }

        if (!shippingAddress.street?.trim()) {
            setError('Please enter your street address')
            setProcessing(false)
            return
        }

        if (!shippingAddress.city?.trim()) {
            setError('Please enter your city')
            setProcessing(false)
            return
        }

        if (!shippingAddress.phone?.trim()) {
            setError('Please enter a phone number')
            setProcessing(false)
            return
        }

        if (cartItems.length === 0) {
            setError('Your cart is empty. Please add items before checkout.')
            setProcessing(false)
            return
        }

        try {
            const totals = calculateTotals()

            // Prepare items for backend - matching Orders collection schema
const itemsForBackend = cartItems.map(item => {
    const productId = String(typeof item.product === 'object' ? (item.product as Product)?.id : item.product)
    const unitPrice = item.price || (item.lineTotal / item.quantity) || 0
    
    console.log('Mapping item:', {
        product: productId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        lineTotal: item.lineTotal,
        originalPrice: item.price
    })
    
    return {
        product: productId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        lineTotal: item.lineTotal,
    }
})

console.log('Final items for backend:', itemsForBackend)

            // Build checkout data matching backend expectations
            const checkoutData = {
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
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                shippingCost: totals.shippingCost,
                tax: totals.tax,
            }

            console.log('Sending checkout data:', checkoutData)

            const result = await processCheckout(checkoutData)

            if (result.success && result.order) {
                setSuccessMessage('Order placed successfully!')
                setTimeout(() => {
                     router.push(`/products`)
                    // router.push(`/order-confirmation/${result.order?.id}`)
                }, 1500)
            } else {
                setError(result.message || 'Failed to place order. Please try again.')
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process checkout'
            setError(errorMessage)
            console.error('Checkout error:', err)
        } finally {
            setProcessing(false)
        }
    }

    const totals = calculateTotals()

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bgLight2.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB4E2C]"></div>
                    <p className="mt-4 text-[#1a3126]">Loading checkout...</p>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bgLight2.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-[#1a3126] mb-4">Your cart is empty</h1>
                    <p className="text-[#1a3126] text-opacity-70 mb-8">Please select items from cart before checkout</p>
                    <Link href="/cart" className="inline-block bg-[#BB4E2C] hover:bg-[#1a3126] text-white font-bold py-3 px-6 rounded-lg">
                        Back to Cart
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bgLight.webp"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Success Popup Modal */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-12 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a3126] mb-3">
                            Order Placed Successfully!
                        </h2>
                        <p className="text-center text-[#1a3126] text-opacity-70 mb-6">
                            Thank you for your purchase. Your order has been confirmed and will be processed soon.
                        </p>

                        {/* Order Details */}
                        <div className="bg-[#F2F0E5] rounded-lg p-4 mb-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1a3126] text-opacity-70">Items:</span>
                                    <span className="font-semibold text-[#1a3126]">{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1a3126] text-opacity-70">Total Amount:</span>
                                    <span className="font-semibold text-[#BB4E2C]">Rs. {totals.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1a3126] text-opacity-70">Payment Method:</span>
                                    <span className="font-semibold text-[#1a3126]">Cash on Delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => router.push('/products')}
                            className="w-full bg-[#BB4E2C] hover:bg-[#1a3126] text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/cart" className="text-[#BB4E2C] hover:text-[#1a3126] font-semibold mb-4 inline-block">
                        ← Back to Cart
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3126]">Checkout</h1>
                    <p className="text-[#1a3126] text-opacity-70 mt-2">Complete your order</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleCheckout} className="space-y-6">
                            {/* Shipping Address Section */}
                            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 ">
                                <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Shipping Address</h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-[#1a3126] mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={shippingAddress.firstName}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-[#1a3126] mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={shippingAddress.lastName}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="street" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={shippingAddress.street}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="123 Main Street"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Area/Colony/Block
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="DHA Phase 5"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="Karachi"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="+92 300 1234567"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 ">
                                <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Payment Method</h2>

                                <label className="flex items-start p-4 border-2 border-[#1a3126] border-opacity-20 rounded-lg cursor-pointer hover:bg-[#F2F0E5] transition">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 mt-1 text-[#BB4E2C] focus:ring-2 focus:ring-[#BB4E2C]"
                                    />
                                    <div className="ml-4 flex-1">
                                        <p className="font-semibold text-[#1a3126]">Cash on Delivery (COD)</p>
                                        <p className="text-sm text-[#1a3126] text-opacity-70 mt-1">
                                            Pay when your order is delivered.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="submit"
                                disabled={processing || cartItems.length === 0}
                                className="w-full bg-[#BB4E2C] hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full transition duration-200 text-lg"
                            >
                                {processing ? 'Processing...' : `Place Order (Rs. ${totals.total.toFixed(2)})`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sticky top-8 ">
                            <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Order Summary</h2>

                            {/* Items List */}
                            <div className="mb-6 space-y-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item, idx) => {
                                    const productTitle = item.productTitle || 'Product'

                                    return (
                                        <div key={idx} className="flex justify-between text-sm border-b border-[#1a3126] border-opacity-10 pb-4">
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#1a3126]">
                                                    {productTitle}
                                                </p>
                                                <p className="text-[#1a3126] text-opacity-70">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[#1a3126]">
                                                Rs. {item.lineTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t-2 border-[#1a3126] border-opacity-20 pt-6">
                                <div className="flex justify-between text-[#1a3126] text-opacity-70">
                                    <span>Subtotal</span>
                                    <span>Rs. {totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#1a3126] text-opacity-70">
                                    <span>Shipping</span>
                                    <span className={totals.shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                                        {totals.shippingCost === 0 ? 'FREE' : `Rs. ${totals.shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-[#BB4E2C] pt-3 border-t-2 border-[#1a3126] border-opacity-20">
                                    <span>Total</span>
                                    <span>Rs. {totals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}