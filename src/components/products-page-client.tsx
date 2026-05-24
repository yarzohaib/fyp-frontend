'use client'

import { useState, useMemo } from 'react'
import Navbar from "@/components/navbar"
import { FilterSidebar } from "@/components/filter-sidebar"
import { ProductsGrid } from "@/components/product-grid"
import { HeroSearch } from "@/components/hero-search"
import type { ProductCardProps, Category, Product, ActiveFilters } from "@/lib/Types"

interface ProductsPageProps {
    initialProducts: Product[]
    categories: Category[]
}

export default function ProductsPageClient({ initialProducts, categories }: ProductsPageProps) {
    const [filters, setFilters] = useState<ActiveFilters>({
        onSale: false,
        inStock: false,
        selectedCategories: [],
    })
    const [showFilters, setShowFilters] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchesTitle = product.title.toLowerCase().includes(q)
                const matchesDesc =
                    product.Description?.toLowerCase().includes(q) ||
                    product.shortDescription?.toLowerCase().includes(q)
                if (!matchesTitle && !matchesDesc) return false
            }

            // On sale filter
            if (filters.onSale && !product.pricing.discountedPrice) {
                return false
            }

            // In stock filter
            if (filters.inStock && (product.inventory?.quantity ?? 0) <= 0) {
                return false
            }

            // Category filter
            if (filters.selectedCategories.length > 0) {
                const productCategoryId = typeof product.category === 'object'
                    ? product.category?.id
                    : product.category
                if (!productCategoryId || !filters.selectedCategories.includes(productCategoryId)) {
                    return false
                }
            }

            return true
        })
    }, [initialProducts, filters, searchQuery])

    const transformedProducts: ProductCardProps[] = filteredProducts.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.pricing.price,
        discountedPrice: product.pricing.discountedPrice,
        image: product.images?.[0]?.image?.url ?? "/placeholder.svg",
        inStock: (product.inventory?.quantity ?? 0) > 0,
        slug: product.slug,
        shortDescription: product.shortDescription,
    }))

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                {/* Hero Search */}
                <div className="mt-16 sm:mt-20 mb-6 sm:mb-8">
                    <HeroSearch value={searchQuery} onSearch={setSearchQuery} />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium text-sm"
                    >
                        {showFilters ? '✕ Close Filters' : '⚙ Show Filters'}
                    </button>

                    {/* Sidebar Filters */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:shrink-0`}>
                        <FilterSidebar
                            categories={categories}
                            onFilterChange={(newFilters) => {
                                setFilters(newFilters)
                                setShowFilters(false)
                            }}
                        />
                    </div>

                    {/* Products Section */}
                    <div className="flex-1 w-full">
                        {transformedProducts.length > 0 ? (
                            <>
                                <div className="mb-4 text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
                                    Showing {transformedProducts.length} product{transformedProducts.length !== 1 ? 's' : ''}
                                    {searchQuery && (
                                        <span className="ml-1">
                                            for <span className="font-medium text-gray-900">"{searchQuery}"</span>
                                        </span>
                                    )}
                                </div>
                                <ProductsGrid products={transformedProducts} />
                            </>
                        ) : (
                            <div className="text-center py-8 sm:py-12 px-4">
                                <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-sm sm:text-base text-gray-500">
                                    {searchQuery
                                        ? `No results for "${searchQuery}". Try a different search term.`
                                        : 'Try adjusting your filters or check back later for new additions to our collection.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
