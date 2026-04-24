// // "use client"

// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Star } from "lucide-react"
// // import type { ProductTabsProps, Review } from "@/lib/Types"

// // export function ProductTabs({ specifications, reviews }: ProductTabsProps) {
// //     // Parse reviews if it's a JSON string
// //     const reviewsData: Review[] = reviews ? (typeof reviews === 'string' ? JSON.parse(reviews) : reviews) : []
    
// //     // Calculate average rating
// //     const averageRating = reviewsData.length > 0 
// //         ? reviewsData.reduce((sum: number, review: Review) => sum + (review.rating || 0), 0) / reviewsData.length
// //         : 0

// //     return (
// //         <div className="mb-16">
// //             <Tabs defaultValue="specs" className="w-full">
// //                 <TabsList className="grid w-full grid-cols-2 bg-secondary/20">
// //                     <TabsTrigger value="specs">Product Specs</TabsTrigger>
// //                     <TabsTrigger value="reviews">
// //                         Reviews and Ratings
// //                         {reviewsData.length > 0 && (
// //                             <span className="ml-2 text-xs text-muted-foreground">
// //                                 ({reviewsData.length})
// //                             </span>
// //                         )}
// //                     </TabsTrigger>
// //                 </TabsList>

// //                 <TabsContent value="specs" className="mt-6">
// //                     <div className="prose prose-sm max-w-none text-foreground/70">
// //                         {specifications ? (
// //                             <div dangerouslySetInnerHTML={{ __html: specifications }} />
// //                         ) : (
// //                             <p className="text-muted-foreground italic">
// //                                 Detailed product specifications will be displayed here. Please check back soon for complete information.
// //                             </p>
// //                         )}
// //                     </div>
// //                 </TabsContent>

// //                 <TabsContent value="reviews" className="mt-6">
// //                     {reviewsData.length > 0 ? (
// //                         <div className="space-y-6">
// //                             {/* Average Rating Summary */}
// //                             <div className="flex items-center gap-4 pb-6 border-b">
// //                                 <div className="text-center">
// //                                     <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
// //                                     <div className="flex items-center justify-center mt-1">
// //                                         {[1, 2, 3, 4, 5].map((star) => (
// //                                             <Star
// //                                                 key={star}
// //                                                 className={`w-4 h-4 ${
// //                                                     star <= Math.round(averageRating)
// //                                                         ? "fill-yellow-400 text-yellow-400"
// //                                                         : "text-gray-300"
// //                                                 }`}
// //                                             />
// //                                         ))}
// //                                     </div>
// //                                     <div className="text-sm text-muted-foreground mt-1">
// //                                         {reviewsData.length} {reviewsData.length === 1 ? 'review' : 'reviews'}
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             {/* Individual Reviews */}
// //                             <div className="space-y-4">
// //                                 {reviewsData.map((review: Review, index: number) => (
// //                                     <div key={index} className="border-b pb-4 last:border-b-0">
// //                                         <div className="flex items-start justify-between mb-2">
// //                                             <div>
// //                                                 <div className="font-medium">{review.user || 'Anonymous'}</div>
// //                                                 <div className="flex items-center mt-1">
// //                                                     {[1, 2, 3, 4, 5].map((star) => (
// //                                                         <Star
// //                                                             key={star}
// //                                                             className={`w-4 h-4 ${
// //                                                                 star <= (review.rating || 0)
// //                                                                     ? "fill-yellow-400 text-yellow-400"
// //                                                                     : "text-gray-300"
// //                                                             }`}
// //                                                         />
// //                                                     ))}
// //                                                 </div>
// //                                             </div>
// //                                             {review.date && (
// //                                                 <div className="text-sm text-muted-foreground">
// //                                                     {new Date(review.date).toLocaleDateString()}
// //                                                 </div>
// //                                             )}
// //                                         </div>
// //                                         {review.comment && (
// //                                             <p className="text-sm text-foreground/70 mt-2">
// //                                                 {review.comment}
// //                                             </p>
// //                                         )}
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     ) : (
// //                         <div className="text-center py-8 text-muted-foreground">
// //                             <p className="italic">No reviews yet. Be the first to review this product!</p>
// //                         </div>
// //                     )}
// //                 </TabsContent>
// //             </Tabs>
// //         </div>
// //     )
// // }


// "use client"

// import { useEffect, useState } from "react"
// import { Star } from "lucide-react"
// import type { Review, PublicReviewsApiResponse } from "@/lib/Types"

// interface ProductReviewsProps {
//     productId: string
// }

// function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
//     const cls = size === "md" ? "w-5 h-5" : "w-4 h-4"
//     return (
//         <div className="flex items-center gap-0.5">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                     key={star}
//                     className={`${cls} ${
//                         star <= Math.round(rating)
//                             ? "fill-[hsl(var(--warning,38_92%_50%))] text-[hsl(var(--warning,38_92%_50%))]"
//                             : "text-muted-foreground/30"
//                     }`}
//                     style={
//                         star <= Math.round(rating)
//                             ? { fill: "rgb(234 179 8)", color: "rgb(234 179 8)" }
//                             : { color: "rgb(203 213 225)" }
//                     }
//                 />
//             ))}
//         </div>
//     )
// }

// function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
//     const pct = total > 0 ? (count / total) * 100 : 0
//     return (
//         <div className="flex items-center gap-2">
//             <span className="text-xs text-muted-foreground w-2 text-right">{star}</span>
//             <div className="flex-1 bg-secondary/40 rounded-full h-2 overflow-hidden">
//                 <div
//                     className="h-full rounded-full transition-all duration-700"
//                     style={{
//                         width: `${pct}%`,
//                         background: "rgb(234 179 8)",
//                     }}
//                 />
//             </div>
//         </div>
//     )
// }

// function getInitials(review: Review): string {
//     if (review.customer?.Name) return review.customer.Name.slice(0, 2).toUpperCase()
//     return "A"
// }

// function getDisplayName(review: Review): string {
//     if (review.customer?.Name) return review.customer.Name
//     return "Anonymous"
// }

// export function ProductReviews({ productId }: ProductReviewsProps) {
//     const [reviews, setReviews] = useState<Review[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//     const [showForm, setShowForm] = useState(false)

//     useEffect(() => {
//         async function fetchReviews() {
//             try {
//                 setLoading(true)
//                 const res = await fetch(`/api/public-products/${productId}/reviews`, {
//                     credentials: "include",
//                 })
//                 if (!res.ok) throw new Error("Failed to fetch reviews")
//                 const data: PublicReviewsApiResponse = await res.json()
//                 setReviews(data.reviews ?? [])
//             } catch (err) {
//                 setError("Could not load reviews.")
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchReviews()
//     }, [productId])

//     const total = reviews.length
//     const average = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0

//     const distribution = [5, 4, 3, 2, 1].map((star) => ({
//         star,
//         count: reviews.filter((r) => Math.round(r.rating) === star).length,
//     }))

//     return (
//         <div className="mb-16">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-foreground">Ratings &amp; Reviews</h2>
//                 <button
//                     onClick={() => setShowForm((v) => !v)}
//                     className="text-sm font-semibold"
//                     style={{ color: "rgb(234 179 8)" }}
//                 >
//                     {showForm ? "Cancel" : "Write a Review"}
//                 </button>
//             </div>

//             {/* Write Review Form */}
//             {showForm && (
//                 <WriteReviewForm
//                     productId={productId}
//                     onSuccess={(newReview) => {
//                         setReviews((prev) => [newReview, ...prev])
//                         setShowForm(false)
//                     }}
//                 />
//             )}

//             {/* Rating Summary Card */}
//             <div className="bg-secondary/20 rounded-2xl p-5 mb-6 flex items-center gap-6">
//                 {/* Left: big number + stars + count */}
//                 <div className="flex flex-col items-center min-w-22.5">
//                     <span className="text-5xl font-extrabold text-foreground leading-none">
//                         {average.toFixed(1)}
//                     </span>
//                     <div className="mt-2">
//                         <StarRating rating={average} size="sm" />
//                     </div>
//                     <span className="text-xs text-muted-foreground mt-1.5">
//                         {total} {total === 1 ? "Review" : "Reviews"}
//                     </span>
//                 </div>

//                 {/* Right: bar chart */}
//                 <div className="flex-1 flex flex-col gap-1.5">
//                     {distribution.map(({ star, count }) => (
//                         <RatingBar key={star} star={star} count={count} total={total} />
//                     ))}
//                 </div>
//             </div>

//             {/* Reviews List */}
//             {loading ? (
//                 <div className="space-y-4">
//                     {[1, 2].map((i) => (
//                         <div key={i} className="animate-pulse flex gap-3 py-4 border-b border-border/50">
//                             <div className="w-10 h-10 rounded-full bg-secondary/50 shrink-0" />
//                             <div className="flex-1 space-y-2">
//                                 <div className="h-4 bg-secondary/50 rounded w-32" />
//                                 <div className="h-3 bg-secondary/40 rounded w-24" />
//                                 <div className="h-3 bg-secondary/30 rounded w-full" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : error ? (
//                 <p className="text-center text-muted-foreground italic py-8">{error}</p>
//             ) : reviews.length === 0 ? (
//                 <p className="text-center text-muted-foreground italic py-8">
//                     No reviews yet. Be the first to review this product!
//                 </p>
//             ) : (
//                 <div className="space-y-0">
//                     {reviews.map((review, idx) => (
//                         <div
//                             key={review.id ?? idx}
//                             className="py-5 border-b border-border/50 last:border-b-0"
//                         >
//                             <div className="flex items-start gap-3">
//                                 {/* Avatar */}
//                                 <div
//                                     className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
//                                     style={{ background: "rgb(234 179 8)" }}
//                                 >
//                                     {getInitials(review)}
//                                 </div>

//                                 {/* Content */}
//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center justify-between gap-2">
//                                         <div className="flex items-center gap-1.5">
//                                             <span className="font-semibold text-sm text-foreground">
//                                                 {getDisplayName(review)}
//                                             </span>
//                                             {/* Verified badge */}
//                                             <svg
//                                                 className="w-4 h-4 shrink-0"
//                                                 viewBox="0 0 20 20"
//                                                 fill="none"
//                                                 style={{ color: "rgb(234 179 8)" }}
//                                             >
//                                                 <circle cx="10" cy="10" r="10" fill="currentColor" />
//                                                 <path
//                                                     d="M6 10l3 3 5-5"
//                                                     stroke="white"
//                                                     strokeWidth="1.8"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                 />
//                                             </svg>
//                                         </div>
//                                         <span className="text-xs text-muted-foreground whitespace-nowrap">
//                                             {new Date(review.createdAt).toLocaleDateString("en-CA")}
//                                         </span>
//                                     </div>

//                                     <div className="mt-1">
//                                         <StarRating rating={review.rating} size="sm" />
//                                     </div>

//                                     {review.title && (
//                                         <p className="text-sm font-medium text-foreground mt-2">
//                                             {review.title}
//                                         </p>
//                                     )}
//                                     <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
//                                         {review.description}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// /* ─── Write Review Form ─────────────────────────────────── */

// function WriteReviewForm({
//     productId,
//     onSuccess,
// }: {
//     productId: string
//     onSuccess: (review: Review) => void
// }) {
//     const [rating, setRating] = useState(0)
//     const [hovered, setHovered] = useState(0)
//     const [title, setTitle] = useState("")
//     const [description, setDescription] = useState("")
//     const [submitting, setSubmitting] = useState(false)
//     const [err, setErr] = useState<string | null>(null)

//     async function handleSubmit() {
//         if (!rating) return setErr("Please select a rating.")
//         if (!description.trim()) return setErr("Please write a review.")
//         setErr(null)
//         setSubmitting(true)
//         try {
//             const res = await fetch("/api/customer/reviews", {
//                 method: "POST",
//                 credentials: "include",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ productId, rating, title: title || undefined, description }),
//             })
//             const data = await res.json()
//             if (!res.ok) throw new Error(data.error ?? "Failed to submit review")
//             onSuccess(data.review)
//         } catch (e: any) {
//             setErr(e.message)
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     return (
//         <div className="bg-secondary/20 rounded-2xl p-5 mb-6 space-y-4">
//             <h3 className="font-semibold text-foreground">Write a Review</h3>

//             {/* Star picker */}
//             <div className="flex items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                         key={star}
//                         type="button"
//                         onMouseEnter={() => setHovered(star)}
//                         onMouseLeave={() => setHovered(0)}
//                         onClick={() => setRating(star)}
//                     >
//                         <Star
//                             className="w-7 h-7 transition-colors"
//                             style={
//                                 star <= (hovered || rating)
//                                     ? { fill: "rgb(234 179 8)", color: "rgb(234 179 8)" }
//                                     : { color: "rgb(203 213 225)" }
//                             }
//                         />
//                     </button>
//                 ))}
//             </div>

//             <input
//                 type="text"
//                 placeholder="Review title (optional)"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
//             />

//             <textarea
//                 placeholder="Share your experience..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={3}
//                 className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none"
//             />

//             {err && <p className="text-sm text-destructive">{err}</p>}

//             <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
//                 style={{ background: "rgb(234 179 8)" }}
//             >
//                 {submitting ? "Submitting…" : "Submit Review"}
//             </button>
//         </div>
//     )
// }
"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import type { Review, PublicReviewsApiResponse } from "@/lib/Types"

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
            <div className="bg-secondary/20 rounded-2xl p-5 mb-6 flex items-center gap-6">
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
    const [submitting, setSubmitting] = useState(false)
    const [err, setErr] = useState<string | null>(null)

   async function handleSubmit() {
  if (!rating) return setErr("Please select a rating.")
  if (!description.trim()) return setErr("Please write a review.")
  setErr(null)
  setSubmitting(true)

  try {
    // Read token from localStorage — same as Flutter's secure storage
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")

    if (!token) {
      setErr("You must be logged in to submit a review.")
      setSubmitting(false)
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

    const res = await fetch(`${baseUrl}/api/customer/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`,  // ✅ send token in header
      },
      body: JSON.stringify({
        productId,
        rating,
        title: title.trim() || undefined,  // ✅ omit if empty (backend rejects empty string)
        description: description.trim(),
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
        <div className="bg-secondary/20 rounded-2xl p-5 mb-6 space-y-4">
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