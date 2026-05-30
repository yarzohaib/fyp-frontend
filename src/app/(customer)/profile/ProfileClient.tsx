'use client'

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
  ChangePasswordRequest,
  Order,
} from '@/lib/Types'
import Link from 'next/link'

// ─── Shared UI primitives (mirrors checkout page) ─────────────────────────────

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
      className={`w-full border-b py-2.5 text-sm text-[#1A3126] placeholder:text-gray-300 outline-none bg-transparent transition-colors ${
        props.disabled
          ? 'border-gray-200 text-[#1A3126]/40 cursor-not-allowed'
          : 'border-gray-300 focus:border-[#1A3126]'
      } ${props.className ?? ''}`}
    />
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} bg-gray-100 animate-pulse`} />
}

function ProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-100 p-6 sm:p-8 space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine w="w-20" h="h-2" />
          <SkeletonLine h="h-8" />
        </div>
      ))}
      <SkeletonLine h="h-12" />
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="bg-white border border-gray-100 p-6 sm:p-8">
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

  useEffect(() => {
    if (!initialProfile) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }
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
    <div className="min-h-screen bg-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/products"
            className="text-xs font-semibold text-[#BB4E2C] hover:text-[#1A3126] transition-colors tracking-wide uppercase"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1A3126]">My Account</h1>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-100">
          <div className="flex">
            {(['profile', 'orders', 'password'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#BB4E2C] text-[#BB4E2C]'
                    : 'border-transparent text-[#1A3126]/40 hover:text-[#1A3126]'
                }`}
              >
                {tab === 'password' ? 'Security' : tab === 'orders' ? 'Orders' : 'Profile'}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          bootstrapping ? <ProfileSkeleton /> : (
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <SectionHeading n={1} label="Personal Information" />
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <TextInput
                    type="email"
                    value={profile?.email ?? ''}
                    disabled
                    placeholder="—"
                  />
                  <p className="text-[10px] text-[#1A3126]/40 mt-1 tracking-wide">Email cannot be changed</p>
                </div>

                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <TextInput
                    type="text" name="Name"
                    value={formData.Name} onChange={handleProfileChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <FieldLabel>Contact Number</FieldLabel>
                  <TextInput
                    type="tel" name="phone"
                    value={formData.phone} onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Account Status</FieldLabel>
                    <p className="py-2.5 text-sm text-[#1A3126] capitalize border-b border-gray-200">
                      {profile?.status ?? '—'}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Member Since</FieldLabel>
                    <p className="py-2.5 text-sm text-[#1A3126] border-b border-gray-200">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit" disabled={isSaving}
                    className="w-full bg-[#BB4E2C] hover:bg-[#1A3126] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 transition-colors text-sm tracking-wide uppercase"
                  >
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          bootstrapping ? <OrdersSkeleton /> : (
            <div className="bg-white border border-gray-100 p-6 sm:p-8">
              <SectionHeading n={2} label="Order History" />
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[#1A3126]/50 mb-6">You haven&#39;t placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-block bg-[#BB4E2C] hover:bg-[#1A3126] text-white text-sm font-semibold px-6 py-3 transition-colors tracking-wide uppercase"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Order ID', 'Date', 'Total', 'Status'].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#1A3126]/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-4 px-4 text-sm text-[#1A3126] font-medium">{order.orderNumber}</td>
                          <td className="py-4 px-4 text-sm text-[#1A3126]/55">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 text-sm font-semibold text-[#BB4E2C]">Rs. {order.total.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 text-xs font-semibold ${getOrderStatusColor(order.orderStatus)}`}>
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
          <div className="bg-white border border-gray-100 p-6 sm:p-8">
            <SectionHeading n={3} label="Change Password" />
            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
              {[
                { id: 'currentPassword', label: 'Current Password', placeholder: 'Enter your current password' },
                { id: 'newPassword',     label: 'New Password',     placeholder: 'At least 6 characters' },
                { id: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <FieldLabel>{label}</FieldLabel>
                  <TextInput
                    type="password" name={id}
                    value={passwordData[id as keyof typeof passwordData]}
                    onChange={handlePasswordChange}
                    placeholder={placeholder}
                    required
                  />
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="submit" disabled={isSaving}
                  className="w-full bg-[#BB4E2C] hover:bg-[#1A3126] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 transition-colors text-sm tracking-wide uppercase"
                >
                  {isSaving ? 'Updating…' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
