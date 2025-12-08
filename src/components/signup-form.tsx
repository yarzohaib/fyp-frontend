"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function SignupForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<UserRole>("customer")
    const [storeName, setStoreName] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { signup } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialRole = (searchParams.get("role") as UserRole) || "customer"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (role === "vendor") {
            if (!storeName.trim()) {
                setError("Store name is required")
                return
            }
            if (!storeDescription.trim()) {
                setError("Store description is required")
                return
            }
        }

        setIsLoading(true)

        try {
            const vendorData = role === "vendor" ? { storeName, storeDescription } : undefined
            await signup(email, password, name, role, vendorData)
            const redirectPath = role === "vendor" ? "/status" : "/";

            router.push(redirectPath)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
                <h1 className="text-4xl font-medium font-serif text-foreground mb-2">Create account</h1>
                <p className="text-foreground/70">Join us and start your journey</p>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Account Type</label>
                <div className="flex gap-3">
                    {(["customer", "vendor"] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setRole(type)}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors capitalize ${role === type ? "bg-[#BB4E2C] text-background" : "bg-transparent text-foreground hover:bg-muted/80"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            {role === "vendor" && (
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Store Name</label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter your store name"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
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

            {role === "vendor" && (
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Store Description</label>
                    <textarea
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder="Describe your store"
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-lg font-semibold"
            >
                {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-foreground/70">
                Already have an account?{" "}
                <Link href="/login" className="text-accent font-semibold hover:underline">
                    Login
                </Link>
            </p>
        </form>
    )
}
