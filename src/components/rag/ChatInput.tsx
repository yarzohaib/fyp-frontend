import { FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  prompt: string;
  loading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function ChatInput({
  prompt,
  loading,
  onPromptChange,
  onSubmit,
  onKeyDown,
}: ChatInputProps) {
  return (
    <div className="p-4 bg-white/80 border-t border-[#F2F0E5] backdrop-blur-sm">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto relative group">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            loading ? 'Waiting for results...' : 'Describe the furniture you are looking for...'
          }
          disabled={loading}
          className="w-full pl-6 pr-[110px] md:pr-36 py-4 md:py-5 bg-[#F9F8F6] border border-[#E4E0D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#BB4E2C]/20 focus:border-[#BB4E2C] text-[#1a3126] placeholder-[#1a3126]/30 resize-none disabled:cursor-wait transition-all shadow-inner text-sm md:text-base h-16 md:h-[72px] flex items-center"
          rows={1}
        />
        <button
          type="submit"
          disabled={loading || !prompt}
          className="absolute top-2.5 right-2.5 bottom-2.5 px-8 rounded-full font-bold text-sm tracking-wider text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#BB4E2C] hover:bg-[#a04225] hover:shadow-lg active:scale-95 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            'SEARCH'
          )}
        </button>
      </form>
      {/* <div className="text-center mt-2">
        <p className="text-[10px] text-[#1a3126]/30 uppercase tracking-widest">
          Powered by Doma AI
        </p>
      </div> */}
    </div>
  );
}
