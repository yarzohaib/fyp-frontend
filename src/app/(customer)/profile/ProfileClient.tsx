'use client'

// src/app/(customer)/profile/ProfileClient.tsx
// Receives server-prefetched data as props → zero loading flash on first paint.
// Falls back to client-side fetch if server data is unavailable (e.g. token in localStorage only).

import Image from 'next/image'
import React, { useEffect, useState, useTransition } from 'react'
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

// ─── Skeleton components ──────────────────────────────────────────────────────

function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} bg-gray-200 rounded animate-pulse`} />
}

function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine w="w-24" h="h-3" />
          <SkeletonLine h="h-11" />
        </div>
      ))}
      <SkeletonLine h="h-11" />
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
            <SkeletonLine w="w-28" />
            <SkeletonLine w="w-24" />
            <SkeletonLine w="w-20" />
            <SkeletonLine w="w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProfileClientProps {
  initialProfile: CustomerProfile | null
  initialOrders: Order[]
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileClient({ initialProfile, initialOrders }: ProfileClientProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<CustomerProfile | null>(initialProfile)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  // Only show skeleton if we have NO initial data (token was in localStorage, not cookie)
  const [bootstrapping, setBootstrapping] = useState(!initialProfile)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'password'>('profile')
  const [isSaving, startSaving] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    Name: initialProfile?.Name ?? '',
    phone: initialProfile?.phone ?? '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // If server had no token (localStorage-only auth), fall back to client fetch
  useEffect(() => {
    if (!initialProfile) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }
      // Client-side fallback: fetch in parallel
      Promise.all([
        fetchCustomerProfile(),
        user?.id ? fetchCustomerOrders(user.id, 1, 10) : Promise.resolve({ docs: [] }),
      ])
        .then(([profileData, ordersData]) => {
          if (profileData) {
            setProfile(profileData)
            setFormData({ Name: profileData.Name ?? '', phone: profileData.phone ?? '' })
          }
          setOrders((ordersData as any).docs ?? [])
        })
        .catch((err) => setError(err.message))
        .finally(() => setBootstrapping(false))
    }
  }, [initialProfile, isAuthenticated, user, router])

  // Keep form in sync if profile updates
  useEffect(() => {
    if (profile) {
      setFormData({ Name: profile.Name ?? '', phone: profile.phone ?? '' })
    }
  }, [profile])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccessMessage(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccessMessage(null)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startSaving(async () => {
      try {
        const result = await updateCustomerProfile({ Name: formData.Name, phone: formData.phone })
        setProfile(result.customer)
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile')
      }
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    startSaving(async () => {
      try {
        await changeCustomerPassword(passwordData as ChangePasswordRequest)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setSuccessMessage('Password changed successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to change password')
      }
    })
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'pending':   return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default:          return 'bg-gray-100 text-gray-800'
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Image src="/bgLight.webp" alt="Background" fill className="object-cover" priority sizes="100vw" />
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

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex flex-wrap gap-2 sm:gap-0">
              {(['profile', 'orders', 'password'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-6 py-4 font-bold border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'password' ? 'Security' : tab === 'orders' ? 'Orders' : 'Profile Info'}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            bootstrapping ? <ProfileSkeleton /> : (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email ?? ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="Name" className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text" id="Name" name="Name"
                      value={formData.Name} onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">Contact Number</label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Account Status</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-gray-900 capitalize font-medium">{profile?.status}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Member Since</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-gray-900">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isSaving}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            bootstrapping ? <OrdersSkeleton /> : (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">You haven&#39;t placed any orders yet.</p>
                    <Link href="/products" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {['Order ID', 'Date', 'Total', 'Status'].map((h) => (
                            <th key={h} className="text-left py-3 px-4 font-semibold text-gray-900">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-4 px-4 text-gray-900 font-medium">{order.orderNumber}</td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 px-4 text-gray-900 font-semibold">Rs. {order.total.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                {[
                  { id: 'currentPassword', label: 'Current Password', placeholder: 'Enter your current password' },
                  { id: 'newPassword',     label: 'New Password',     placeholder: 'Enter your new password' },
                  { id: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Confirm your new password' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
                    <input
                      type="password" id={id} name={id}
                      value={passwordData[id as keyof typeof passwordData]}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition"
                      placeholder={placeholder}
                      required
                    />
                    {id === 'newPassword' && (
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit" disabled={isSaving}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  {isSaving ? 'Updating…' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}