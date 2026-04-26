'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// This page is at: src/app/(customer)/payment/success/page.tsx
//
// How it gets reached:
//   1. Customer pays on Safepay's page
//   2. Safepay redirects to /api/payments/safepay/confirm (your backend)
//   3. That route verifies signature, marks order paid, clears cart
//   4. Then redirects HERE with ?orderId=xxx
//
// This page just shows a nice UI — the real work already happened in confirm/route.ts

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get('orderId') || searchParams.get('order_id') || ''
    const [countdown, setCountdown] = useState(8)

    useEffect(() => {
        if (countdown <= 0) { router.push('/products'); return }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(t)
    }, [countdown, router])

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2F0E5' }}>
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-500" />
                    <div className="p-8 sm:p-12 text-center">

                        {/* Check icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a3126' }}>Payment Successful!</h1>
                        <p className="text-gray-500 mb-6">Your payment was processed securely via Safepay.</p>

                        {orderId && (
                            <div className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-8" style={{ backgroundColor: '#F2F0E5', color: '#1a3126' }}>
                                Order ID: <span style={{ color: '#BB4E2C' }}>{orderId}</span>
                            </div>
                        )}

                        <div className="text-left rounded-xl p-5 mb-8 space-y-3" style={{ backgroundColor: '#F2F0E5' }}>
                            <p className="font-semibold text-sm" style={{ color: '#1a3126' }}>What happens next?</p>
                            {['✅ Your order has been confirmed', '📦 Vendor will prepare your items', '🚚 You will receive delivery updates'].map((s) => (
                                <p key={s} className="text-sm" style={{ color: '#1a3126', opacity: 0.75 }}>{s}</p>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/profile" className="flex-1 py-3 px-4 rounded-full font-semibold text-center border-2 transition hover:opacity-80" style={{ borderColor: '#1a3126', color: '#1a3126' }}>
                                View Orders
                            </Link>
                            <Link href="/products" className="flex-1 py-3 px-4 rounded-full font-semibold text-center text-white transition hover:opacity-90" style={{ backgroundColor: '#BB4E2C' }}>
                                Continue Shopping
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-gray-400">Redirecting to shop in {countdown}s…</p>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    Payment secured by <a href="https://getsafepay.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Safepay</a>
                </p>
            </div>
        </div>
    )
}