"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { requestPasswordReset, verifyOtpAndReset } from "@/lib/password-auth"
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"

function VerifyForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""

  // 5 OTP inputs
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  // Countdown timer
  const [seconds, setSeconds] = useState(60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    setSeconds(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); return 0 }
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // digits only
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last char if pasted
    setOtp(newOtp)
    if (value && index < 4) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5)
    const newOtp = [...otp]
    pasted.split("").forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 4)]?.focus()
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    try {
      await requestPasswordReset(email)
      setOtp(["", "", "", "", ""])
      inputRefs.current[0]?.focus()
      startTimer()
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const otpString = otp.join("")
    if (otpString.length < 5) {
      setError("Please enter the complete 5-digit code")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await verifyOtpAndReset(email, otpString, newPassword)
      setDone(true)
      setTimeout(() => router.push("/login/customer"), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-medium mb-3">Password Updated!</h1>
        <p className="text-background/60 text-sm">
          Your password has been reset. Redirecting to login...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/forgot-password"
        className="inline-flex items-center gap-2 text-background/60 hover:text-background mb-10 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="text-3xl font-serif font-medium mb-2">Enter Verification Code</h1>
      <p className="text-background/60 mb-1 text-sm">
        We sent a 5-digit code to{" "}
        <span className="text-background font-medium">{email}</span>
      </p>
      <p className="text-background/40 text-xs mb-8">Check your spam folder if you don&apos;t see it.</p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* OTP Boxes */}
        <div>
          <label className="block text-sm text-background/70 mb-3">Verification Code</label>
          <div className="flex gap-3 justify-between" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-background/10 border border-background/20 rounded-xl text-background focus:outline-none focus:border-accent transition-colors"
              />
            ))}
          </div>

          {/* Resend timer */}
          <div className="mt-3 text-center">
            {seconds > 0 ? (
              <span className="text-background/40 text-xs">Resend code in {seconds}s</span>
            ) : resending ? (
              <span className="text-background/40 text-xs">Sending...</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-accent text-xs font-semibold hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10" />

        {/* New Password */}
        <div>
          <label className="block text-sm text-background/70 mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-background/10 border border-background/20 rounded-xl px-4 pr-10 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background/70"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-background/70 mb-1.5">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            className="w-full bg-background/10 border border-background/20 rounded-xl px-4 py-3 text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors"
          />
          {confirmPassword.length > 0 && (
            <p className={`text-xs mt-1.5 ${newPassword === confirmPassword ? "text-green-400" : "text-red-400"}`}>
              {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold rounded-xl py-3 transition-colors"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-foreground text-background flex flex-col items-center justify-center p-8 min-h-screen">
        <Suspense fallback={<div className="text-background/50">Loading...</div>}>
          <VerifyForm />
        </Suspense>
      </div>
      <div className="hidden lg:w-1/2 lg:flex bg-background items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-foreground mb-4">Almost There!</h2>
          <p className="text-xl text-foreground/70">Enter the code from your email.</p>
        </div>
      </div>
    </div>
  )
}