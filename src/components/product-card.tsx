import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "./add-to-cart-button"
import { WishlistButton } from "./wishlist-button"
import { buildImageUrl } from "@/lib/utils"
import type { ProductCardProps } from "@/lib/Types"

export type { ProductCardProps }

function StarRating({ rating, count }: { rating: number; count: number }) {
    const filled = Math.round(rating)
    return (
        <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <svg
                        key={i}
                        className={`w-3 h-3 ${i <= filled ? 'text-[#BB4E2C]' : 'text-gray-200'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <span className="text-[11px] text-gray-400">({count})</span>
        </div>
    )
}

function calculateInStock(inStock?: boolean, inventory?: { quantity: number }): boolean {
    if (inStock !== undefined) return inStock
    return (inventory?.quantity ?? 0) > 0
}

export function ProductCard({
    id,
    title,
    price,
    discountedPrice,
    image,
    secondImage,
    inStock,
    inventory,
    slug,
    rating,
    reviewCount,
}: ProductCardProps) {
    const href = slug ? `/products/${slug}` : `/products/${id}`
    const displayImage = buildImageUrl(image) ?? "/placeholder.svg"
    const displaySecondImage = secondImage ? (buildImageUrl(secondImage) ?? null) : null
    const isInStock = calculateInStock(inStock, inventory)
    const effectivePrice = discountedPrice ?? price

    return (
        <Link href={href} className="group block">
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white p-3 border border-gray-100">

                {/* Primary image — fades out on hover if a second image exists */}
                <Image
                    src={displayImage}
                    alt={title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className={`object-contain transition-all duration-500 ${
                        displaySecondImage
                            ? 'group-hover:opacity-0'
                            : 'group-hover:scale-105'
                    }`}
                />

                {/* Second image — crossfades in on hover */}
                {displaySecondImage && (
                    <Image
                        src={displaySecondImage}
                        alt={`${title} – alternate view`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {!isInStock && (
                        <span className="bg-[#BB4E2C] text-white text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5">
                            Out of Stock
                        </span>
                    )}
                    {!!discountedPrice && isInStock && (
                        <span className="bg-[#1A3126] text-white text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5">
                            Sale
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <div className="absolute top-2 right-2 z-10">
                    <WishlistButton
                        item={{ id, title, price: effectivePrice, image: displayImage, slug, inStock: isInStock }}
                    />
                </div>

                {/* Hover add-to-cart */}
                <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <AddToCartButton
                        id={id}
                        title={title}
                        price={effectivePrice}
                        image={displayImage}
                        slug={slug}
                        quantity={1}
                        inStock={isInStock}
                        variant="hover"
                    />
                </div>
            </div>

            {/* Info: Name → Stars → Price */}
            <div className="pt-3 pb-1">
                <h3 className="text-sm font-medium text-[#1A3126] leading-snug line-clamp-2">{title}</h3>

                {rating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
                    <StarRating rating={rating} count={reviewCount} />
                )}

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {discountedPrice ? (
                        <>
                            <span className="text-sm font-semibold text-[#BB4E2C]">
                                Rs. {discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                Rs. {price.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-semibold text-[#1A3126]">
                            Rs. {price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
