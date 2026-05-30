import { FormEvent, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
    prompt: string
    loading: boolean
    onPromptChange: (value: string) => void
    onSubmit: (e: FormEvent) => void
    onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function ChatInput({ prompt, loading, onPromptChange, onSubmit, onKeyDown }: ChatInputProps) {
    return (
        <div className="shrink-0 border-t border-gray-100 bg-white p-4">
            <form onSubmit={onSubmit} className="flex items-end gap-2">
                <textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={loading ? 'Waiting for response...' : 'Describe the furniture you\'re looking for...'}
                    disabled={loading}
                    rows={1}
                    className="flex-1 resize-none border border-gray-200 px-4 py-3 text-sm text-[#1A3126] placeholder:text-[#1A3126]/30 focus:border-[#1A3126] outline-none transition-colors disabled:cursor-wait bg-white leading-relaxed"
                    style={{ maxHeight: '120px', overflowY: 'auto' }}
                    onInput={(e) => {
                        const t = e.currentTarget
                        t.style.height = 'auto'
                        t.style.height = Math.min(t.scrollHeight, 120) + 'px'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="shrink-0 w-11 h-11 bg-[#BB4E2C] text-white flex items-center justify-center hover:bg-[#1A3126] disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send"
                >
                    {loading ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </button>
            </form>
            <p className="text-[10px] text-[#1A3126]/30 mt-2 tracking-wider uppercase text-center">
                Enter to send · Shift+Enter for new line
            </p>
        </div>
    )
}
