export async function googleLogin(idToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customer/google-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Google login failed")
  }

  return data // { success, token, user }
}