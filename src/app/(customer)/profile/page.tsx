'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import {
    fetchCustomerProfile,
    updateCustomerProfile,
    changeCustomerPassword,
    fetchCustomerOrders,
} from '@/lib/payload'
import type {
    CustomerProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    Order,
} from '@/lib/Types'
import Link from 'next/link'



export default function CustomerProfilePage() {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<CustomerProfile | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'password'>('profile')
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Profile Form State
    const [formData, setFormData] = useState({
        Name: '',
        phone: '',
    })

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        loadProfileData()
    }, [isAuthenticated, router, user])

    const loadProfileData = async () => {
        try {
            setLoading(true)
            setError(null)

            const profileData = await fetchCustomerProfile()
            if (profileData) {
                setProfile(profileData)
                setFormData({
                    Name: profileData.Name || '',
                    phone: profileData.phone || '',
                })
            }

            // Fetch orders using customer ID
            if (user?.id) {
                const ordersData = await fetchCustomerOrders(user.id, 1, 10)
                if (ordersData.docs) {
                    setOrders(ordersData.docs)
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
            setError(errorMessage)
            console.error('Error loading profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setSuccessMessage(null)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setSuccessMessage(null)
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            const updateData: UpdateProfileRequest = {
                Name: formData.Name,
                phone: formData.phone,
            }

            const result = await updateCustomerProfile(updateData)
            setProfile(result.customer)
            setSuccessMessage('Profile updated successfully!')
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
            setError(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match')
            setIsSaving(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters')
            setIsSaving(false)
            return
        }

        try {
            const changePasswordData: ChangePasswordRequest = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            }

            await changeCustomerPassword(changePasswordData)
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            setSuccessMessage('Password changed successfully!')
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password'
            setError(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F2F0E5' }}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    <p className="mt-4 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F2F0E5' }}>
                <div className="text-center">
                    <p className="text-gray-600">Unable to load profile. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative">
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

            <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-2 text-xl">Manage your account settings and view your orders</p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">{successMessage}</p>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="mb-8 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2 sm:gap-0">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 sm:flex-none px-6 py-4 font-bold border-b-2 transition-colors ${
                                    activeTab === 'profile'
                                        ? 'border-amber-600 text-amber-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Profile Info
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 sm:flex-none px-6 py-4 font-bold border-b-2 transition-colors ${
                                    activeTab === 'orders'
                                        ? 'border-amber-600 text-amber-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 sm:flex-none px-6 py-4 font-bold border-b-2 transition-colors ${
                                    activeTab === 'password'
                                        ? 'border-amber-600 text-amber-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Security
                            </button>
                        </div>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email cannot be changed
                                    </p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label htmlFor="Name" className="block text-sm font-medium text-gray-900 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="Name"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleProfileChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleProfileChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Account Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Account Status
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                                        <span className="text-gray-900 capitalize font-medium">
                                            {profile.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Member Since
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                                        <span className="text-gray-900">
                                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 mb-4">You haven&#39;t placed any orders yet.</p>
                                    <Link
                                        href="/products"
                                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                    Order ID
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                    Date
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                    Total
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                                >
                                                    <td className="py-4 px-4 text-gray-900 font-medium">
                                                        {order.orderNumber}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-900 font-semibold">
                                                        Rs. {order.total.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
                                                                order.orderStatus
                                                            )}`}
                                                        >
                                                            {order.orderStatus.charAt(0).toUpperCase() +
                                                                order.orderStatus.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                {/* Current Password */}
                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-medium text-gray-900 mb-2"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                                        placeholder="Enter your current password"
                                        required
                                    />
                                </div>

                                {/* New Password */}
                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-gray-900 mb-2"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                                        placeholder="Enter your new password"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-900 mb-2"
                                    >
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                                        placeholder="Confirm your new password"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                                    >
                                        {isSaving ? 'Updating...' : 'Change Password'}
                                    </button>
                                </div>

                                {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Tip:</strong> Use a strong password with a mix of uppercase,
                                        lowercase, numbers, and special characters for better security.
                                    </p>
                                </div> */}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
