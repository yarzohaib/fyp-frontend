"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
    role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            await login(email, password, role)
            const redirectPath = role === "vendor" ? "/products" : "/"
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
                <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back!</h1>
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
                    <Link href="#" className="text-sm text-accent hover:underline">
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

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-foreground">
                    Remember for 30 days
                </label>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-lg font-semibold"
            >
                {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-foreground/50">or</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                </button>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 13.5c0-1.8 1.5-3.25 3.35-3.25 1.85 0 3.35 1.45 3.35 3.25s-1.5 3.25-3.35 3.25c-1.85 0-3.35-1.45-3.35-3.25zm3.35-2.25c-1.27 0-2.35 1.02-2.35 2.25s1.08 2.25 2.35 2.25 2.35-1.02 2.35-2.25-1.08-2.25-2.35-2.25z" />
                    </svg>
                    <span className="text-sm font-medium">Apple</span>
                </button>
            </div>

            <p className="text-center text-sm text-foreground/70">
                Don&apos;t have an account?{" "}
                <Link href={`/signup`} className="text-accent font-semibold hover:underline">
                    Sign Up
                </Link>
            </p>
        </form>
    )
}
