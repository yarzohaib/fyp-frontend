'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatHeader } from './ChatHeader';
import { ChatMessage, type Product } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingIndicator } from './LoadingIndicator';
import { EmptyState } from './EmptyState';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse {
  result?: string;
  error?: string;
  products?: Product[];
  ragUsed?: boolean;
}

interface ChatMessageType {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

export function RAGSearch() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    setPrompt('');
    setLoading(true);
    setError('');

    const userMessage: ChatMessageType = { role: 'user', content: currentPrompt };
    const previousMessages = messages;
    const pendingMessages = [...previousMessages, userMessage];
    setMessages(pendingMessages);

    try {
      // ✅ Calls your PayloadCMS backend which proxies to RAG project
      const response = await fetch(`${BACKEND_URL}/api/rag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          useRAG: true,
          history: previousMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.result) {
        setMessages([...pendingMessages, {
          role: 'assistant',
          content: data.result,
          products: data.products || [],
        }]);
      }
    } catch {
      setError('Failed to connect to Genie. Please try again.');
      setMessages(previousMessages);
      setPrompt(currentPrompt);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(e as unknown as FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0E5] text-[#1a3126] font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col h-screen gap-6">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#1a3126]/60 hover:text-[#BB4E2C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </button>

        <ChatHeader />

        {/* Chat Window */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/50 rounded-4xl shadow-xl shadow-[#1a3126]/5 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {messages.length === 0 && <EmptyState />}
            {messages.map((message, index) => (
              <ChatMessage
                key={`message-${index}`}
                role={message.role}
                content={message.content}
                products={message.products}
              />
            ))}
            {loading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#BB4E2C] text-white text-sm rounded-full shadow-lg z-10">
              {error}
            </div>
          )}

          <ChatInput
            prompt={prompt}
            loading={loading}
            onPromptChange={setPrompt}
            onSubmit={handleGenerate}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import { useState, FormEvent, useRef, useEffect } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { ChatHeader } from './ChatHeader';
// import { ChatMessage, type Product } from './ChatMessage';
// import { ChatInput } from './ChatInput';
// import { LoadingIndicator } from './LoadingIndicator';
// import { EmptyState } from './EmptyState';


// interface ApiResponse {
//   error?: string;
//   results?: Product[];
// }

// interface ChatMessageType {
//   role: 'user' | 'assistant';
//   content: string;
//   products?: Product[];
// }

// export function RAGSearch() {
//   const router = useRouter();
//   const [prompt, setPrompt] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [messages, setMessages] = useState<ChatMessageType[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   const handleGenerate = async (e: FormEvent) => {
//     e.preventDefault();
//     const currentPrompt = prompt.trim();
//     if (!currentPrompt) return;

//     setPrompt('');
//     setLoading(true);
//     setError('');

//     const userMessage: ChatMessageType = { role: 'user', content: currentPrompt };
//     const previousMessages = messages;
//     const pendingMessages = [...previousMessages, userMessage];
//     setMessages(pendingMessages);

//     try {
//       const response = await fetch('https://rag-chatbot-psi-kohl.vercel.app/api/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: currentPrompt}),
//       });

//       const data: ApiResponse = await response.json();

//       if (data.error) {
//         setError(data.error);
//       } else  {
//         setMessages([...pendingMessages, {
//     role: 'assistant',
//     content: data.results?.length
//       ? `Found ${data.results.length} products for you.`
//       : "Sorry, I couldn't find any matching products.",
//     products: data.results || [],
//   }]);
//       }
//     } catch {
//       setError('Failed to connect to Genie. Please try again.');
//       setMessages(previousMessages);
//       setPrompt(currentPrompt);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleGenerate(e as unknown as FormEvent);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F2F0E5] text-[#1a3126] font-sans">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col h-screen gap-6">

//         {/* Back button */}
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-sm text-[#1a3126]/60 hover:text-[#BB4E2C] transition-colors w-fit"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to store
//         </button>

//         <ChatHeader />

//         {/* Chat Window */}
//         <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/50 rounded-4xl shadow-xl shadow-[#1a3126]/5 flex flex-col overflow-hidden relative">
//           <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
//             {messages.length === 0 && <EmptyState />}
//             {messages.map((message, index) => (
//               <ChatMessage
//                 key={`message-${index}`}
//                 role={message.role}
//                 content={message.content}
//                 products={message.products}
//               />
//             ))}
//             {loading && <LoadingIndicator />}
//             <div ref={messagesEndRef} />
//           </div>

//           {error && (
//             <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#BB4E2C] text-white text-sm rounded-full shadow-lg z-10">
//               {error}
//             </div>
//           )}

//           <ChatInput
//             prompt={prompt}
//             loading={loading}
//             onPromptChange={setPrompt}
//             onSubmit={handleGenerate}
//             onKeyDown={handleKeyDown}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }