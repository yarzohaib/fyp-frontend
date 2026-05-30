"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Star, X } from "lucide-react"
import type { Review } from "@/lib/Types"

// Payload REST at depth=2 returns nested customer with Name + avatar
interface RawReview extends Omit<Review, "customer"> {
    customer?: {
        id: string
        Name?: string | null
        name?: string | null
        avatar?: { url?: string } | null
    } | null
}

interface ProductReviewsProps {
    productId: string
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const cls = size === "md" ? "w-5 h-5" : "w-4 h-4"
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${cls} ${
                        star <= Math.round(rating)
                            ? "fill-[hsl(var(--warning,38_92%_50%))] text-[hsl(var(--warning,38_92%_50%))]"
                            : "text-muted-foreground/30"
                    }`}
                    style={
                        star <= Math.round(rating)
                            ? { fill: "rgb(234 179 8)", color: "rgb(234 179 8)" }
                            : { color: "rgb(203 213 225)" }
                    }
                />
            ))}
        </div>
    )
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total > 0 ? (count / total) * 100 : 0
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-2 text-right">{star}</span>
            <div className="flex-1 bg-secondary/40 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${pct}%`,
                        background: "rgb(234 179 8)",
                    }}
                />
            </div>
        </div>
    )
}

function getInitials(review: RawReview): string {
    const name = review.customer?.Name || review.customer?.name
    if (name) return name.slice(0, 2).toUpperCase()
    return "A"
}

function getDisplayName(review: RawReview): string {
    return review.customer?.Name || review.customer?.name || "Verified Customer"
}

function getAvatarUrl(review: RawReview): string | null {
    const avatar = review.customer?.avatar
    if (avatar && typeof avatar === "object" && avatar.url) return avatar.url
    return null
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<RawReview[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    const fetchReviews = async () => {
        try {
            setLoading(true)
            setError(null)
            // Use the Payload backend URL directly (same as mobile app)
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
            const res = await fetch(
                `${baseUrl}/api/public-products/${productId}/reviews?limit=50`,
                { credentials: "include" }
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            // Payload REST returns { docs: [...] }
            setReviews(data.reviews ?? [])
        } catch (err) {
            setError("Could not load reviews.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const total = reviews.length
    const average = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }))

    return (
        <div className="mb-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Ratings &amp; Reviews</h2>
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="text-sm font-semibold"
                    style={{ color: "rgb(234 179 8)" }}
                >
                    {showForm ? "Cancel" : "Write a Review"}
                </button>
            </div>

            {/* Write Review Form */}
            {showForm && (
                <WriteReviewForm
                    productId={productId}
                    onSuccess={() => {
                        setShowForm(false)
                        fetchReviews() // Re-fetch from server so the new review appears with full customer data
                    }}
                />
            )}

            {/* Rating Summary Card */}
            <div className="bg-secondary/20 p-5 mb-6 flex items-center gap-6">
                {/* Left: big number + stars + count */}
                <div className="flex flex-col items-center min-w-22.5">
                    <span className="text-5xl font-extrabold text-foreground leading-none">
                        {average.toFixed(1)}
                    </span>
                    <div className="mt-2">
                        <StarRating rating={average} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1.5">
                        {total} {total === 1 ? "Review" : "Reviews"}
                    </span>
                </div>

                {/* Right: bar chart */}
                <div className="flex-1 flex flex-col gap-1.5">
                    {distribution.map(({ star, count }) => (
                        <RatingBar key={star} star={star} count={count} total={total} />
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex gap-3 py-4 border-b border-border/50">
                            <div className="w-10 h-10 rounded-full bg-secondary/50 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-secondary/50 rounded w-32" />
                                <div className="h-3 bg-secondary/40 rounded w-24" />
                                <div className="h-3 bg-secondary/30 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-center text-muted-foreground italic py-8">{error}</p>
            ) : reviews.length === 0 ? (
                <p className="text-center text-muted-foreground italic py-8">
                    No reviews yet. Be the first to review this product!
                </p>
            ) : (
                <div className="space-y-0">
                    {reviews.map((review, idx) => (
                        <div
                            key={review.id ?? idx}
                            className="py-5 border-b border-border/50 last:border-b-0"
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                {getAvatarUrl(review) ? (
                                    <img
                                        src={getAvatarUrl(review)!}
                                        alt={getDisplayName(review)}
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                        style={{ background: "rgb(234 179 8)" }}
                                    >
                                        {getInitials(review)}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-sm text-foreground">
                                                {getDisplayName(review)}
                                            </span>
                                            {/* Verified badge */}
                                            <svg
                                                className="w-4 h-4 shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                style={{ color: "rgb(234 179 8)" }}
                                            >
                                                <circle cx="10" cy="10" r="10" fill="currentColor" />
                                                <path
                                                    d="M6 10l3 3 5-5"
                                                    stroke="white"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(review.createdAt).toLocaleDateString("en-CA")}
                                        </span>
                                    </div>

                                    <div className="mt-1">
                                        <StarRating rating={review.rating} size="sm" />
                                    </div>

                                    {review.title && (
                                        <p className="text-sm font-medium text-foreground mt-2">
                                            {review.title}
                                        </p>
                                    )}
                                    <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
                                        {review.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ─── Write Review Form ─────────────────────────────────── */

function WriteReviewForm({
    productId,
    onSuccess,
}: {
    productId: string
    onSuccess: () => void
}) {
    const [rating, setRating] = useState(0)
    const [hovered, setHovered] = useState(0)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [photos, setPhotos] = useState<File[]>([])
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [err, setErr] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        const remaining = 5 - photos.length
        const toAdd = files.slice(0, remaining)
        setPhotos((prev) => [...prev, ...toAdd])
        setPhotoPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))])
        e.target.value = ""
    }

    function removePhoto(index: number) {
        URL.revokeObjectURL(photoPreviews[index])
        setPhotos((prev) => prev.filter((_, i) => i !== index))
        setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    async function uploadPhoto(file: File, token: string, baseUrl: string): Promise<string> {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch(`${baseUrl}/api/media`, {
            method: "POST",
            headers: { Authorization: `JWT ${token}` },
            body: form,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.errors?.[0]?.message ?? "Photo upload failed")
        return data.doc.id as string
    }

    async function handleSubmit() {
        if (!rating) return setErr("Please select a rating.")
        if (!description.trim()) return setErr("Please write a review.")
        setErr(null)
        setSubmitting(true)

        try {
            const token = localStorage.getItem("authToken") || localStorage.getItem("token")
            if (!token) {
                setErr("You must be logged in to submit a review.")
                setSubmitting(false)
                return
            }

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

            const photoIds = await Promise.all(
                photos.map((file) => uploadPhoto(file, token, baseUrl))
            )

            const res = await fetch(`${baseUrl}/api/customer/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${token}`,
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    title: title.trim() || undefined,
                    description: description.trim(),
                    photos: photoIds.map((id) => ({ image: id })),
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Failed to submit review")
            onSuccess()
        } catch (e: any) {
            setErr(e.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-secondary/20 p-5 mb-6 space-y-4">
            <h3 className="font-semibold text-foreground">Write a Review</h3>

            {/* Star picker */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            className="w-7 h-7 transition-colors"
                            style={
                                star <= (hovered || rating)
                                    ? { fill: "rgb(234 179 8)", color: "rgb(234 179 8)" }
                                    : { color: "rgb(203 213 225)" }
                            }
                        />
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder="Review title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            />

            <textarea
                placeholder="Share your experience..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none"
            />

            {/* Photo upload */}
            <div className="space-y-2">
                {photoPreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {photoPreviews.map((src, i) => (
                            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/60">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {photos.length < 5 && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoSelect}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed border-border/60 rounded-lg px-3 py-2 hover:border-yellow-400/60 hover:text-foreground transition-colors"
                        >
                            <ImagePlus className="w-4 h-4" />
                            Add photos ({photos.length}/5)
                        </button>
                    </>
                )}
            </div>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: "rgb(234 179 8)" }}
            >
                {submitting ? "Submitting…" : "Submit Review"}
            </button>
        </div>
    )
}