
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'
 
export const metadata: Metadata = {
  title: 'My Profile — DOMA',
  description: 'Manage your account, view orders, and update your settings.',
  robots: { index: false, follow: false }, // profile pages shouldn't be indexed
}
 
// Pull the JWT from the cookie that Payload sets on login
async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  // Payload sets a cookie named `payload-token` by default
  return (
    cookieStore.get('payload-token')?.value ??
    cookieStore.get('authToken')?.value ??
    null
  )
}
 
async function fetchProfileSSR(token: string) {
  const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const res = await fetch(`${BASE}/api/customer/profile`, {
    headers: { Authorization: `JWT ${token}` },
    // No caching — profile data must always be fresh
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.customer ?? null
}
 
async function fetchOrdersSSR(token: string, customerId: string) {
  const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const res = await fetch(
    `${BASE}/api/orders/user/${customerId}?page=1&limit=10&depth=2`,
    {
      headers: { Authorization: `JWT ${token}` },
      cache: 'no-store',
    },
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.docs ?? []
}
 
export default async function ProfilePage() {
  const token = await getTokenFromCookies()
 
  // Not logged in via cookie — let the client handle redirect
  // (token may be in localStorage only, so we fall back gracefully)
  if (!token) {
    // Render the client component which will redirect via useAuth
    return <ProfileClient initialProfile={null} initialOrders={[]} />
  }
 
  // Fetch both in parallel — cuts load time in half vs sequential fetches
  const profile = await fetchProfileSSR(token)
 
  const orders = profile
    ? await fetchOrdersSSR(token, profile.id)
    : []
 
  return <ProfileClient initialProfile={profile} initialOrders={orders} />
}
