// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// export type UserRole = "customer" | "vendor"

// export interface AuthUser {
//     id: string
//     email: string
//     role: UserRole
//     name: string
// }

// interface AuthContextType {
//     user: AuthUser | null
//     token: string | null
//     isLoading: boolean
//     login: (email: string, password: string, role: UserRole) => Promise<void>
//     signup: (
//         email: string,
//         password: string,
//         name: string,
//         role: UserRole,
//         vendorData?: { storeName: string; storeDescription: string },
//     ) => Promise<void>
//     logout: () => void
//     isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<AuthUser | null>(null)
//     const [token, setToken] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState(true)

//     // Check for existing token on mount
//     useEffect(() => {
//         const savedToken = localStorage.getItem("authToken")
//         const savedUser = localStorage.getItem("authUser")
//         if (savedToken && savedUser) {
//             setToken(savedToken)
//             setUser(JSON.parse(savedUser))
//         }
//         setIsLoading(false)
//     }, [])

//     const login = async (email: string, password: string, role: UserRole) => {
//         try {
//             setIsLoading(true)
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password, role }),
//             })

//             if (!response.ok) {
//                 throw new Error("Login failed")
//             }

//             const data = await response.json()
//             setToken(data.token)
//             setUser(data.user)
//             localStorage.setItem("authToken", data.token)
//             localStorage.setItem("authUser", JSON.stringify(data.user))
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const signup = async (
//         email: string,
//         password: string,
//         name: string,
//         role: UserRole,
//         vendorData?: { storeName: string; storeDescription: string },
//     ) => {
//         try {
//             setIsLoading(true)
//             const body = role === "vendor" ? { email, password, name, role, ...vendorData } : { email, password, name, role }

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(body),
//             })

//             if (!response.ok) {
//                 throw new Error("Signup failed")
//             }

//             const data = await response.json()
//             setToken(data.token)
//             setUser(data.user)
//             localStorage.setItem("authToken", data.token)
//             localStorage.setItem("authUser", JSON.stringify(data.user))
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const logout = () => {
//         setUser(null)
//         setToken(null)
//         localStorage.removeItem("authToken")
//         localStorage.removeItem("authUser")
//     }

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 token,
//                 isLoading,
//                 login,
//                 signup,
//                 logout,
//                 isAuthenticated: !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export function useAuth() {
//     const context = useContext(AuthContext)
//     if (context === undefined) {
//         throw new Error("useAuth must be used within an AuthProvider")
//     }
//     return context
// }




"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "customer" | "vendor"
export type UserStatus = "approved" | "pending" | "rejected"

interface SignupBaseBody {
    email: string
    password: string
    name: string
}

type SignupRequestBody =
    | SignupBaseBody
    | (SignupBaseBody & {
        role: "vendor"
        status: UserStatus
        storeName?: string
        storeDescription?: string
    })

export interface AuthUser {
    id: string
    email: string
    role: UserRole
    name: string
    status: UserStatus
}

interface AuthContextType {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string, role: UserRole) => Promise<void>
    signup: (
        email: string,
        password: string,
        name: string,
        role: UserRole,
        vendorData?: { storeName: string; storeDescription: string },
    ) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load saved session
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem("authToken")
            const savedUser = localStorage.getItem("authUser")

            if (savedToken && savedUser && savedUser !== "undefined" && savedUser !== "null") {
                try {
                    const parsedUser = JSON.parse(savedUser)
                    // Validate that parsedUser has required fields
                    if (parsedUser && typeof parsedUser === "object" && parsedUser.id && parsedUser.email) {
                        setToken(savedToken)
                        setUser(parsedUser)
                    } else {
                        // Invalid user data, clear it
                        localStorage.removeItem("authToken")
                        localStorage.removeItem("authUser")
                    }
                } catch (parseError) {
                    // Invalid JSON, clear corrupted data
                    console.error("Failed to parse saved user data:", parseError)
                    localStorage.removeItem("authToken")
                    localStorage.removeItem("authUser")
                }
            }
        } catch (error) {
            console.error("Error loading saved session:", error)
            // Clear potentially corrupted data
            localStorage.removeItem("authToken")
            localStorage.removeItem("authUser")
        } finally {
            setIsLoading(false)
        }
    }, [])

    // LOGIN
    const login = async (email: string, password: string, role: UserRole) => {
        try {
            setIsLoading(true)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${role}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                },
            )

            if (!response.ok) {
                throw new Error("Login failed")
            }

            const data = await response.json()
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem("authToken", data.token)
            localStorage.setItem("authUser", JSON.stringify(data.user))
        } finally {
            setIsLoading(false)
        }
    }

    // SIGNUP
    const signup = async (
        email: string,
        password: string,
        name: string,
        role: UserRole,
        vendorData?: { storeName: string; storeDescription: string },
    ) => {
        try {
            setIsLoading(true)

            let body: SignupRequestBody = { email, password, name }

            if (role === "vendor") {
                body = {
                    ...body,
                    role: "vendor",          // REQUIRED
                    status: "pending",        // REQUIRED
                    storeName: vendorData?.storeName,
                    storeDescription: vendorData?.storeDescription,
                }
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${role}/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                },
            )

            if (!response.ok) {
                const error = await response.json().catch(() => null)
                throw new Error(error?.message || "Signup failed")
            }

            const data = await response.json()

            setToken(data.token)
            setUser(data.user)

            localStorage.setItem("authToken", data.token)
            localStorage.setItem("authUser", JSON.stringify(data.user))
        } finally {
            setIsLoading(false)
        }
    }


    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}




// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// export type UserRole = "customer" | "vendor"
// export type UserStatus = "approved" | "pending" | "rejected";


// export interface AuthUser {
//     id: string
//     email: string
//     role: UserRole
//     name: string
//     status: UserStatus
// }

// interface AuthContextType {
//     user: AuthUser | null
//     token: string | null
//     isLoading: boolean
//     login: (email: string, password: string, role: UserRole) => Promise<void>
//     signup: (
//         email: string,
//         password: string,
//         name: string,
//         role: UserRole,
//         vendorData?: { storeName: string; storeDescription: string },
//     ) => Promise<void>
//     logout: () => void
//     isAuthenticated: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<AuthUser | null>(null)
//     const [token, setToken] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState(true)

//     // Load saved session
//     useEffect(() => {
//         const savedToken = localStorage.getItem("authToken")
//         const savedUser = localStorage.getItem("authUser")
//         if (savedToken && savedUser) {
//             setToken(savedToken)
//             setUser(JSON.parse(savedUser))
//         }
//         setIsLoading(false)
//     }, [])

//     const login = async (email: string, password: string, role: UserRole) => {
//         try {
//             setIsLoading(true)
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${role}s/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password, role }),
//             })

//             if (!response.ok) {
//                 throw new Error("Login failed")
//             }

//             const data = await response.json()
//             setToken(data.token)
//             setUser(data.user)
//             localStorage.setItem("authToken", data.token)
//             localStorage.setItem("authUser", JSON.stringify(data.user))
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const signup = async (
//         email: string,
//         password: string,
//         name: string,
//         role: UserRole,
//         vendorData?: { storeName: string; storeDescription: string },
//     ) => {
//         try {
//             setIsLoading(true)
//             const body =
//                 role === "vendor"
//                     ? { email, password, name, role, ...vendorData }
//                     : { email, password, name, role }

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${role}s`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(body),
//             })

//             if (!response.ok) {
//                 throw new Error("Signup failed")
//             }

//             const data = await response.json()
//             setToken(data.token)
//             setUser(data.user)
//             localStorage.setItem("authToken", data.token)
//             localStorage.setItem("authUser", JSON.stringify(data.user))
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const logout = () => {
//         setUser(null)
//         setToken(null)
//         localStorage.removeItem("authToken")
//         localStorage.removeItem("authUser")
//     }

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 token,
//                 isLoading,
//                 login,
//                 signup,
//                 logout,
//                 isAuthenticated: !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export function useAuth() {
//     const context = useContext(AuthContext)
//     if (context === undefined) {
//         throw new Error("useAuth must be used within an AuthProvider")
//     }
//     return context
// }
