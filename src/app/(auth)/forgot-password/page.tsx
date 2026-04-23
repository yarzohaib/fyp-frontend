"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { requestPasswordReset } from "@/lib/password-auth"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await requestPasswordReset(email)
      // Pass email to next step via query param
      router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left - Dark */}
      <div className="w-full lg:w-1/2 bg-foreground text-background flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-sm">

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-background/60 hover:text-background mb-10 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-serif font-medium mb-2">Forgot Password?</h1>
          <p className="text-background/60 mb-8 text-sm">
            Enter your email and we&apos;ll send you a 5-digit code.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-background/70 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-background/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-background/10 border border-background/20 rounded-xl pl-10 pr-4 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold rounded-xl py-3 transition-colors"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Light */}
      <div className="hidden lg:w-1/2 lg:flex bg-background items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-foreground mb-4">Forgot Password?</h2>
          <p className="text-xl text-foreground/70">We&apos;ll get you back in.</p>
        </div>
      </div>

    </div>
  )
}