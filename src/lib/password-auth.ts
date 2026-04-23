const API = process.env.NEXT_PUBLIC_API_URL

export async function requestPasswordReset(email: string) {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
  const res = await fetch(`${API}/api/customers/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to send OTP")
  return data
}

export async function verifyOtpAndReset(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${API}/api/customers/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to reset password")
  return data
}