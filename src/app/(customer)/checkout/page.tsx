'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import {
    fetchCustomerProfile,
    fetchUserCart,
    processCheckout,
} from '@/lib/payload'
import type {
    CustomerProfile,
    CheckoutShippingAddress,
    CheckoutItem,
} from '@/lib/Types'
import Link from 'next/link'



export default function CheckoutPage() {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()

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

    const [useProfileAddress, setUseProfileAddress] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState('cod')

    // Load initial data
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        loadCheckoutData()
    }, [isAuthenticated, router, user])

    const loadCheckoutData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch customer profile
            const profileData = await fetchCustomerProfile()
            if (profileData) {
                setProfile(profileData)

                // Auto-fill shipping address from profile
                if (profileData.addresses && profileData.addresses.length > 0) {
                    const defaultAddress = profileData.addresses.find((a) => a.isDefault) || profileData.addresses[0]
                    const nameParts = defaultAddress.firstName && defaultAddress.lastName 
                        ? `${defaultAddress.firstName} ${defaultAddress.lastName}` 
                        : profileData.Name || ''
                    
                    setShippingAddress({
                        firstName: nameParts,
                        lastName: '',
                        street: defaultAddress.street || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || '',
                        country: 'Pakistan',
                        phone: defaultAddress.phone || profileData.phone || '',
                    })
                } else {
                    // Fallback to profile name and phone
                    setShippingAddress((prev) => ({
                        ...prev,
                        firstName: profileData.Name || '',
                        lastName: '',
                        phone: profileData.phone || '',
                        country: 'Pakistan',
                    }))
                }
            }

            // Fetch cart
            const cart = await fetchUserCart()
            if (cart && cart.items) {
                setCartItems(cart.items as CheckoutItem[])
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
        const subtotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0)
        const shippingCost = subtotal > 1000 ? 0 : 100
        const total = subtotal + shippingCost

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        }
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcessing(true)
        setError(null)

        // Validation
        if (!shippingAddress.firstName) {
            setError('Please enter your name')
            setProcessing(false)
            return
        }

        if (!shippingAddress.street) {
            setError('Please enter your street address')
            setProcessing(false)
            return
        }

        if (!shippingAddress.city) {
            setError('Please enter your city')
            setProcessing(false)
            return
        }

        if (!shippingAddress.phone) {
            setError('Please enter a phone number')
            setProcessing(false)
            return
        }

        try {
            const totals = calculateTotals()

            const checkoutData = {
                shippingAddress: {
                    firstName: shippingAddress.firstName,
                    lastName: shippingAddress.lastName || '',
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state || '',
                    country: 'Pakistan',
                    phone: shippingAddress.phone,
                },
                paymentMethod,
                paymentStatus: 'pending',
                shippingCost: totals.shippingCost,
            }

            const result = await processCheckout(checkoutData)

            if (result.success && result.order) {
                setSuccessMessage('Order placed successfully!')
                setTimeout(() => {
                    router.push(`/order-confirmation/${result.order.id}`)
                }, 1500)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process checkout'
            setError(errorMessage)
        } finally {
            setProcessing(false)
        }
    }

    const totals = calculateTotals()

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#F2F0E5] to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB4E2C]"></div>
                    <p className="mt-4 text-[#1a3126]">Loading checkout...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#F2F0E5] to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
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

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">{successMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleCheckout} className="space-y-6">
                            {/* Shipping Address Section */}
                            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border-l-4 border-[#BB4E2C]">
                                <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Shipping Address</h2>

                                {/* Use Profile Address Option */}
                                {profile?.addresses && profile.addresses.length > 0 && (
                                    <div className="mb-6 p-4 bg-[#F2F0E5] rounded-lg border border-[#1a3126] border-opacity-20">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useProfileAddress}
                                                onChange={(e) => setUseProfileAddress(e.target.checked)}
                                                className="w-4 h-4 text-[#BB4E2C] rounded focus:ring-2 focus:ring-[#BB4E2C]"
                                            />
                                            <span className="ml-3 text-[#1a3126] font-medium">
                                                Use saved address from profile
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {/* Address Form Fields */}
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={shippingAddress.firstName}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="Your Full Name"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label htmlFor="street" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={shippingAddress.street}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="Street Address"
                                            required
                                        />
                                    </div>

                                    {/* Street / Area */}
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Street
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            className="w-full px-4 py-3 border-2 border-[#1a3126] border-opacity-20 rounded-lg focus:ring-2 focus:ring-[#BB4E2C] focus:border-transparent outline-none transition"
                                            placeholder="Area/Colony/Block"
                                        />
                                    </div>

                                    {/* City */}
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
                                            placeholder="Karachi, Lahore, etc."
                                            required
                                        />
                                    </div>

                                    {/* Phone Number */}
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
                                            placeholder="+92 (300) 1234567"
                                            required
                                        />
                                    </div>

                                    {/* Country (Fixed to Pakistan) */}
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-[#1a3126] mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={shippingAddress.country}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-[#1a3126] border-opacity-20 rounded-lg text-[#1a3126] cursor-not-allowed"
                                        />
                                        <p className="text-xs text-[#1a3126] text-opacity-70 mt-1">
                                            Currently shipping only to Pakistan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border-l-4 border-[#1a3126]">
                                <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Payment Method</h2>

                                <div className="space-y-4">
                                    {/* COD Option */}
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
                                                Pay when your order is delivered. Simple and convenient.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        💳 <strong>Note:</strong> Currently, only Cash on Delivery is available. Additional payment methods coming soon.
                                    </p>
                                </div> */}
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="submit"
                                disabled={processing || cartItems.length === 0}
                                className="w-full bg-[#BB4E2C] hover:bg-[#1a3126] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg"
                            >
                                {processing ? 'Processing...' : `Place Order`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sticky top-8 border-t-4 border-[#BB4E2C]">
                            <h2 className="text-2xl font-bold text-[#1a3126] mb-6">Order Summary</h2>

                            {/* Items List */}
                            <div className="mb-6 space-y-4 max-h-64 overflow-y-auto">
                                {cartItems.length === 0 ? (
                                    <p className="text-[#1a3126] text-opacity-70 text-center py-4">Your cart is empty</p>
                                ) : (
                                    cartItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm border-b border-[#1a3126] border-opacity-10 pb-4">
                                            <div className="flex-1">
                                                <p className="font-semibold text-[#1a3126]">
                                                    {item.productTitle || 'Product'}
                                                </p>
                                                <p className="text-[#1a3126] text-opacity-70">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[#1a3126]">
                                                Rs. {item.total.toFixed(2)}
                                            </p>
                                        </div>
                                    ))
                                )}
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

                            {/* Free Shipping Info
                            {totals.shippingCost > 0 && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-800">
                                        🚚 Add Rs. {(1000 - totals.subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
