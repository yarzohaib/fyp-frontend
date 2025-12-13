"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"
import type { ProductTabsProps, Review } from "@/lib/Types"

export function ProductTabs({ specifications, reviews }: ProductTabsProps) {
    // Parse reviews if it's a JSON string
    const reviewsData: Review[] = reviews ? (typeof reviews === 'string' ? JSON.parse(reviews) : reviews) : []
    
    // Calculate average rating
    const averageRating = reviewsData.length > 0 
        ? reviewsData.reduce((sum: number, review: Review) => sum + (review.rating || 0), 0) / reviewsData.length
        : 0

    return (
        <div className="mb-16">
            <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/20">
                    <TabsTrigger value="specs">Product Specs</TabsTrigger>
                    <TabsTrigger value="reviews">
                        Reviews and Ratings
                        {reviewsData.length > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground">
                                ({reviewsData.length})
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-6">
                    <div className="prose prose-sm max-w-none text-foreground/70">
                        {specifications ? (
                            <div dangerouslySetInnerHTML={{ __html: specifications }} />
                        ) : (
                            <p className="text-muted-foreground italic">
                                Detailed product specifications will be displayed here. Please check back soon for complete information.
                            </p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    {reviewsData.length > 0 ? (
                        <div className="space-y-6">
                            {/* Average Rating Summary */}
                            <div className="flex items-center gap-4 pb-6 border-b">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                                    <div className="flex items-center justify-center mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${
                                                    star <= Math.round(averageRating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {reviewsData.length} {reviewsData.length === 1 ? 'review' : 'reviews'}
                                    </div>
                                </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-4">
                                {reviewsData.map((review: Review, index: number) => (
                                    <div key={index} className="border-b pb-4 last:border-b-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-medium">{review.user || 'Anonymous'}</div>
                                                <div className="flex items-center mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${
                                                                star <= (review.rating || 0)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.date && (
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        {review.comment && (
                                            <p className="text-sm text-foreground/70 mt-2">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="italic">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}