"use client"

import type React from "react"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import type { LoginFormProps } from "@/lib/Types"

export function LoginForm({ role }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login, loginWithGoogle } = useAuth()
    const router = useRouter()

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) return
        setError("")
        setIsLoading(true)
        try {
            await loginWithGoogle(credentialResponse.credential)
            router.push("/products")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Google login failed.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(email, password, role)
            const redirectPath = role === "vendor" ? "/dashboard" : "/products"
            router.push(redirectPath)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
                <h1 className="text-4xl font-medium font-serif text-foreground mb-2">Welcome back!</h1>
                <p className="text-foreground/70">Enter your credentials to access your {role} account</p>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-foreground">Password</label>
                    <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-lg font-semibold"
            >
                {isLoading ? "Logging in..." : "Login"}
            </Button>

            {role === "customer" && (
                <>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background text-foreground/50">or</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google sign-in failed or was cancelled")}
                            width="100%"
                            shape="rectangular"
                            theme="outline"
                            size="large"
                            text="continue_with"
                        />
                    </div>
                </>
            )}

            <p className="text-center text-sm text-foreground/70">
                Don&apos;t have an account?{" "}
                <Link href={`/signup`} className="text-accent font-semibold hover:underline">
                    Sign Up
                </Link>
            </p>
        </form>
    )
}