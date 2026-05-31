'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, Sparkles, RefreshCw, ShoppingBag, X, Maximize2 } from 'lucide-react'

type RoomStyle = 'modern' | 'minimalist' | 'bohemian' | 'scandinavian' | 'industrial' | 'contemporary'

interface MatchedProduct {
  item: string
  name: string
  price: number
  category: string
  imageUrl: string
  productId: string
  shopUrl: string
  score: number
}

interface RedesignResult {
  redesignedImage: string
  style: string
  matchedProducts: MatchedProduct[]
}

const STYLES: { value: RoomStyle; label: string }[] = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'scandinavian', label: 'Scandinavian' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'contemporary', label: 'Contemporary' },
]

export function RoomRedesign() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<RoomStyle>('modern')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RedesignResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const handleRedesign = async () => {
    if (!selectedImage) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('https://doma-ai.vercel.app/api/v1/redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          style: selectedStyle,
          ...(customPrompt.trim() && { prompt: customPrompt.trim() }),
        }),
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Redesign failed')

      setResult({
        redesignedImage: data.data.redesignedImage,
        style: data.data.style,
        matchedProducts: data.data.matchedProducts ?? [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
    setCustomPrompt('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-brand-offwhite">

      {/* ── Fullscreen overlay ── */}
      {fullscreen && result && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white
                       bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-6 my-10">
            <Image
              src={result.redesignedImage}
              alt="Redesigned room fullscreen"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <p className="absolute bottom-5 text-white/30 text-xs tracking-widest uppercase">
            Click anywhere to close
          </p>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="bg-brand-green py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-center">
         
          
          <h1 className="text-brand-offwhite text-4xl md:text-5xl font-serif font-medium mb-4">
            DOMA Redesign
          </h1>
          <p className="text-brand-offwhite/60 text-lg max-w-2xl mx-auto">
            Upload a room photo, pick a style, DOMA redesigns it with real
            catalog products and lets you shop the look.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Controls ── */}
          <div className="space-y-6">

            {/* Upload Zone */}
            <div>
              <label className="block text-brand-green text-sm font-semibold mb-2
                                tracking-widest uppercase">
                Your Room
              </label>
              <div
                onClick={() => !selectedImage && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed
                            transition-all duration-200 overflow-hidden
                            ${isDragging
                              ? 'border-brand-orange bg-brand-orange/5'
                              : 'border-brand-green/20 hover:border-brand-green/40 bg-white'
                            }
                            ${selectedImage ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {selectedImage ? (
                  <>
                    <Image src={selectedImage} alt="Selected room" fill className="object-cover" />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80
                                 text-white rounded-full p-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80
                                 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
                    >
                      Change photo
                    </button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-brand-green/50" />
                    </div>
                    <div className="text-center">
                      <p className="text-brand-green/70 font-medium">Drop a room photo here</p>
                      <p className="text-brand-green/40 text-sm mt-1">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-brand-green text-sm font-semibold mb-3 tracking-widest uppercase">
                Style
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${selectedStyle === style.value
                          ? 'bg-[#BB4E2C] text-[#ffffff] shadow-md'
                          : 'bg-white text-[#1A3126] border border-[#1A3126]/20 hover:border-[#BB4E2C]/40 hover:text-[#BB4E2C]'
                        }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-brand-green text-sm font-semibold mb-2 tracking-widest uppercase">
                Custom Prompt{' '}
                <span className="normal-case tracking-normal text-brand-green/40 font-normal">(optional)</span>
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. add a fireplace, warm lighting, large windows..."
                rows={3}
                className="w-full bg-white border border-brand-green/20 rounded-xl
                           px-4 py-3 text-brand-green placeholder-brand-green/30
                           text-sm resize-none focus:outline-none
                           focus:border-brand-orange/50 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRedesign}
              disabled={!selectedImage || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-base tracking-wide
                transition-all duration-200
                ${selectedImage && !isLoading
                  ? 'bg-[#BB4E2C] hover:bg-[#a8431f] text-[#ffffff] shadow-lg'
                  : 'bg-[#BB4E2C]/20 text-[#BB4E2C]/40 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redesigning your room...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Redesign Room
                </span>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl px-4 py-3 text-brand-orange text-sm">
                {error}
              </div>
            )}
          </div>

          {/* ── Right: Result ── */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-brand-green text-sm font-semibold tracking-widest uppercase">
                  {result ? `Result · ${result.style.charAt(0).toUpperCase() + result.style.slice(1)}` : 'Your Result'}
                </label>
                {result && (
                  <span className="text-brand-orange text-xs font-semibold uppercase tracking-widest">
                    After
                  </span>
                )}
              </div>

            {/* Result image area — always aspect-[4/3] to match upload zone */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-brand-green/15 bg-white">
              {result ? (
                <>
                  <Image
                    src={result.redesignedImage}
                    alt="Redesigned room"
                    fill
                    className="object-cover cursor-zoom-in"
                    onClick={() => setFullscreen(true)}
                  />

                  {/* Before thumbnail — PiP bottom-left */}
                  {selectedImage && (
                    <div className="absolute bottom-3 left-3 w-24 rounded-lg overflow-hidden
                                    border-2 border-white/80 shadow-lg">
                      <div className="relative aspect-[4/3]">
                        <Image src={selectedImage} alt="Before" fill className="object-cover" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white
                                      text-[9px] text-center py-0.5 font-semibold tracking-widest uppercase">
                        Before
                      </div>
                    </div>
                  )}

                  {/* Fullscreen button */}
                  <button
                    onClick={() => setFullscreen(true)}
                    className="absolute top-3 right-3 flex items-center gap-1.5
                               bg-black/60 hover:bg-black/80 text-white
                               text-xs font-medium px-3 py-1.5 rounded-full
                               transition-colors backdrop-blur-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    View Fullscreen
                  </button>
                </>
              ) : isLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <svg className="animate-spin w-8 h-8 text-brand-orange/50" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-brand-green/40 text-sm">Creating your redesign…</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-brand-orange/50" />
                  </div>
                  <p className="text-brand-green/40 text-sm">Your redesigned room will appear here</p>
                </div>
              )}
            </div>
            </div>

            {/* Action Buttons — only show after result */}
            {result && (
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5
                             rounded-xl border border-brand-green/20 text-brand-green/60
                             hover:text-brand-green hover:border-brand-green/50
                             text-sm transition-colors bg-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Another
                </button>
                <button
                  onClick={handleRedesign}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5
                             rounded-xl bg-brand-orange/10 hover:bg-brand-orange/20
                             text-brand-orange text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Redesign Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Shop the Look ── */}
        {result?.matchedProducts && result.matchedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              <h3 className="text-brand-green text-2xl font-serif">Shop This Room</h3>
              <span className="bg-brand-orange text-brand-offwhite text-xs font-bold px-2.5 py-1 rounded-full">
                {result.matchedProducts.length} DOMA products used
              </span>
            </div>
            <p className="text-brand-green/50 text-sm mb-8">
              These products from the DOMA catalog were used to style your room. Click Shop to purchase.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {result.matchedProducts.map((product) => (
                <Link
                  key={product.productId}
                  href={`/products/${product.productId}`}
                  className="group overflow-hidden rounded-xl transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#ffffff]/60">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-sm font-medium text-[#1A3126] mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#BB4E2C]">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
