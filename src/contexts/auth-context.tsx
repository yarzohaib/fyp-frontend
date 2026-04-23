// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import type {
//     UserRole,
//     UserStatus,

//     AuthUser,
//     AuthContextType,
// } from "@/lib/Types"
// import { loginUser, signupUser } from "@/lib/payload"

// export type { UserRole, UserStatus, AuthUser }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<AuthUser | null>(null)
//     const [token, setToken] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState(true)

//     // Load saved session
//     useEffect(() => {
//         try {
//             const savedToken = localStorage.getItem("authToken")
//             const savedUser = localStorage.getItem("authUser")

//             if (savedToken && savedUser && savedUser !== "undefined" && savedUser !== "null") {
//                 try {
//                     const parsedUser = JSON.parse(savedUser)
//                     // Validate that parsedUser has required fields
//                     if (parsedUser && typeof parsedUser === "object" && parsedUser.id && parsedUser.email) {
//                         setToken(savedToken)
//                         setUser(parsedUser)
//                     } else {
//                         // Invalid user data, clear it
//                         localStorage.removeItem("authToken")
//                         localStorage.removeItem("authUser")
//                     }
//                 } catch (parseError) {
//                     // Invalid JSON, clear corrupted data
//                     console.error("Failed to parse saved user data:", parseError)
//                     localStorage.removeItem("authToken")
//                     localStorage.removeItem("authUser")
//                 }
//             }
//         } catch (error) {
//             console.error("Error loading saved session:", error)
//             // Clear potentially corrupted data
//             localStorage.removeItem("authToken")
//             localStorage.removeItem("authUser")
//         } finally {
//             setIsLoading(false)
//         }
//     }, [])

//     // LOGIN
//     const login = async (email: string, password: string, role: UserRole) => {
//         try {
//             setIsLoading(true)

//             const data = await loginUser(email, password, role)
//             setToken(data.token)
//             setUser(data.user)
//             localStorage.setItem("authToken", data.token)
//             localStorage.setItem("authUser", JSON.stringify(data.user))
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     // SIGNUP
//     const signup = async (
//         email: string,
//         password: string,
//         name: string,
//         role: UserRole,
//         vendorData?: { storeName: string; storeDescription: string },
//     ) => {
//         try {
//             setIsLoading(true)

//             const data = await signupUser(email, password, name, role, vendorData)
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
import type {
    UserRole,
    UserStatus,
    AuthUser,
    AuthContextType,
} from "@/lib/Types"
import { loginUser, signupUser } from "@/lib/payload"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { googleLogin } from "@/lib/google-auth"

export type { UserRole, UserStatus, AuthUser }

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
                    if (parsedUser && typeof parsedUser === "object" && parsedUser.id && parsedUser.email) {
                        setToken(savedToken)
                        setUser(parsedUser)
                    } else {
                        localStorage.removeItem("authToken")
                        localStorage.removeItem("authUser")
                    }
                } catch (parseError) {
                    console.error("Failed to parse saved user data:", parseError)
                    localStorage.removeItem("authToken")
                    localStorage.removeItem("authUser")
                }
            }
        } catch (error) {
            console.error("Error loading saved session:", error)
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
            const data = await loginUser(email, password, role)
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem("authToken", data.token)
            localStorage.setItem("authUser", JSON.stringify(data.user))
        } finally {
            setIsLoading(false)
        }
    }

    // GOOGLE LOGIN
    const loginWithGoogle = async (idToken: string) => {
        try {
            setIsLoading(true)
            const data = await googleLogin(idToken)
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
            const data = await signupUser(email, password, name, role, vendorData)
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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <AuthContext.Provider
                value={{
                    user,
                    token,
                    isLoading,
                    login,
                    loginWithGoogle,
                    signup,
                    logout,
                    isAuthenticated: !!user,
                }}
            >
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}