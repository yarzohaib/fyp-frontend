'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, X } from 'lucide-react'
import { ChatMessage, type Product } from '@/components/rag/ChatMessage'
import { ChatInput } from '@/components/rag/ChatInput'
import { LoadingIndicator } from '@/components/rag/LoadingIndicator'
import { EmptyState } from '@/components/rag/EmptyState'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/status']

interface ChatMessageType {
    role: 'user' | 'assistant'
    content: string
    products?: Product[]
}

interface ApiResponse {
    result?: string
    error?: string
    products?: Product[]
}

export function DomaSenseButton() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [messages, setMessages] = useState<ChatMessageType[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const isAuth = AUTH_ROUTES.some(r => pathname?.startsWith(r))
    if (isAuth) return null

    const handleGenerate = async (e: FormEvent) => {
        e.preventDefault()
        const currentPrompt = prompt.trim()
        if (!currentPrompt) return

        setPrompt('')
        setLoading(true)
        setError('')

        const userMessage: ChatMessageType = { role: 'user', content: currentPrompt }
        const previousMessages = messages
        const pendingMessages = [...previousMessages, userMessage]
        setMessages(pendingMessages)

        try {
            const response = await fetch(`${BACKEND_URL}/api/rag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt, useRAG: true, history: previousMessages }),
            })
            if (!response.ok) throw new Error(`Server error: ${response.status}`)
            const data: ApiResponse = await response.json()
            if (data.error) {
                setError(data.error)
            } else if (data.result) {
                setMessages([...pendingMessages, {
                    role: 'assistant',
                    content: data.result,
                    products: data.products || [],
                }])
            }
        } catch {
            setError('Failed to connect. Please try again.')
            setMessages(previousMessages)
            setPrompt(currentPrompt)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleGenerate(e as unknown as FormEvent)
        }
    }

    return (
        <>
            {/* Floating button — hidden when panel is open */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-[9996] flex items-center gap-2
                               bg-[#1A3126] text-[#F2F0E5] pl-4 pr-5 py-3 rounded-full
                               shadow-lg shadow-[#1A3126]/30
                               hover:bg-[#27493A] hover:shadow-xl hover:-translate-y-0.5
                               transition-all duration-300 text-sm font-serif font-medium"
                >
                    <Sparkles className="w-4 h-4 text-[#BB4E2C] shrink-0" />
                    Ask DOMA Sense
                </button>
            )}

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-[9997] lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Slide-in panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#F2F0E5] z-[9998]
                            flex flex-col shadow-2xl
                            transition-transform duration-300 ease-in-out
                            ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="bg-[#1A3126] px-5 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#BB4E2C]" />
                        <span className="text-[#F2F0E5] font-semibold text-base tracking-wide">
                            DOMA Sense
                        </span>
                        <span className="bg-[#BB4E2C]/20 border border-[#BB4E2C]/50 text-[#BB4E2C]
                                         text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                            AI
                        </span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-[#F2F0E5]/50 hover:text-[#F2F0E5] transition-colors p-1 rounded-lg hover:bg-white/10"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub-header hint */}
                <div className="px-5 py-3 border-b border-[#1A3126]/10 bg-white/40 shrink-0">
                    <p className="text-xs text-[#1A3126]/50 leading-relaxed">
                        Describe what you&apos;re looking for and I&apos;ll find the perfect pieces for your space.
                    </p>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {messages.length === 0 && <EmptyState />}
                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={i}
                            role={msg.role}
                            content={msg.content}
                            products={msg.products}
                        />
                    ))}
                    {loading && <LoadingIndicator />}
                    {error && (
                        <div className="text-center text-xs text-[#BB4E2C] bg-[#BB4E2C]/10 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatInput
                    prompt={prompt}
                    loading={loading}
                    onPromptChange={setPrompt}
                    onSubmit={handleGenerate}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </>
    )
}
