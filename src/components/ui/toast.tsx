'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'

export type ToastType = 'wishlist' | 'cart'

interface ToastItem {
    id: number
    message: string
    type: ToastType
    exiting: boolean
}

interface ToastContextValue {
    showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const counter = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
    }, [])

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = ++counter.current
        setToasts(prev => [...prev, { id, message, type, exiting: false }])
        setTimeout(() => dismiss(id), 5000)
    }, [dismiss])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-20 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 bg-[#1A3126] text-[#F2F0E5] px-4 py-3 rounded-xl shadow-xl pointer-events-auto ${
                            toast.exiting ? 'animate-toast-out' : 'animate-toast-in'
                        }`}
                    >
                        {toast.type === 'wishlist' ? (
                            <Heart className="h-4 w-4 fill-[#BB4E2C] text-[#BB4E2C] shrink-0" />
                        ) : (
                            <ShoppingCart className="h-4 w-4 text-[#F2F0E5] shrink-0" />
                        )}
                        <span className="text-sm font-medium whitespace-nowrap">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
