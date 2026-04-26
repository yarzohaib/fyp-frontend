'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// This page is at: src/app/(customer)/payment/cancel/page.tsx
//
// How it gets reached:
//   1. Customer clicks cancel/back on Safepay's page, OR payment fails
//   2. Safepay redirects to /api/payments/safepay/cancel (your backend)
//   3. That route marks order paymentStatus: "failed" in DB
//   4. Then redirects HERE with ?reason=cancelled or ?reason=...
//
// The order still exists in the DB (status: failed) — the customer can retry.

const REASON_MESSAGES: Record<string, string> = {
    cancelled: "You cancelled the payment. Your order has been saved — you can try again.",
    invalid_signature: "We could not verify the payment response. Please contact support.",
    missing_params: "Something went wrong with the payment redirect. Please try again.",
    server_error: "A server error occurred while confirming your payment. Please contact support.",
}

export default function PaymentCancelPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const reason = searchParams.get('reason') || 'cancelled'
    const message = REASON_MESSAGES[reason] || REASON_MESSAGES['cancelled']

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2F0E5' }}>
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Red top bar */}
                    <div className="h-2 bg-gradient-to-r from-red-400 to-rose-500" />

                    <div className="p-8 sm:p-12 text-center">

                        {/* X icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a3126' }}>Payment Cancelled</h1>
                        <p className="text-gray-500 mb-8">{message}</p>

                        {/* Options */}
                        <div className="rounded-xl p-5 mb-8 text-left space-y-2" style={{ backgroundColor: '#F2F0E5' }}>
                            <p className="font-semibold text-sm mb-3" style={{ color: '#1a3126' }}>What would you like to do?</p>
                            <p className="text-sm" style={{ color: '#1a3126', opacity: 0.75 }}>🔄 Go back to checkout and try a different payment method</p>
                            <p className="text-sm" style={{ color: '#1a3126', opacity: 0.75 }}>🛒 Return to your cart to review your items</p>
                            <p className="text-sm" style={{ color: '#1a3126', opacity: 0.75 }}>📞 Contact support if you were charged but order failed</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-4 rounded-full font-semibold border-2 transition hover:opacity-80"
                                style={{ borderColor: '#1a3126', color: '#1a3126' }}
                            >
                                ← Try Again
                            </button>
                            <Link
                                href="/cart"
                                className="flex-1 py-3 px-4 rounded-full font-semibold text-center text-white transition hover:opacity-90"
                                style={{ backgroundColor: '#BB4E2C' }}
                            >
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Need help? Contact our support team.
                </p>
            </div>
        </div>
    )
}