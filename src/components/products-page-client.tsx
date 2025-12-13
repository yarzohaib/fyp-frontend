'use client'

import { useState, useMemo } from 'react'
import Navbar from "@/components/navbar"
import { HeroSearch } from "@/components/hero-search"
import { FilterSidebar } from "@/components/filter-sidebar"
import { ProductsGrid } from "@/components/product-grid"
import type { ProductCardProps, Category, Product, ActiveFilters } from "@/lib/Types"

interface ProductsPageProps {
    initialProducts: Product[]
    categories: Category[]
}

// Client Component - handles filtering and state
export default function ProductsPageClient({ initialProducts, categories }: ProductsPageProps) {
    const [filters, setFilters] = useState<ActiveFilters>({
        onSale: false,
        inStock: false,
        selectedCategories: [],
    })
    const [showFilters, setShowFilters] = useState(false)

    // Filter products based on active filters
    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            
            // ✅ NEW FILTER LOGIC: Filter by 'On Sale'
            // Assumes a product is 'On Sale' if it has a comparePrice set.
            if (filters.onSale && !product.pricing.comparePrice) {
                return false
            }

            // Filter by stock if "In Stock" is checked
            if (filters.inStock && (product.inventory?.quantity ?? 0) <= 0) {
                return false
            }

            // Filter by category if any categories are selected
            if (filters.selectedCategories.length > 0) {
                const productCategoryId = typeof product.category === 'object' 
                    ? product.category?.id 
                    : product.category

                // If product has no category ID, exclude it from filtered results
                if (!productCategoryId || !filters.selectedCategories.includes(productCategoryId)) {
                    return false
                }
            }

            return true
        })
    }, [initialProducts, filters])

    // Transform filtered products to ProductCardProps for display
    const transformedProducts: ProductCardProps[] = filteredProducts.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.pricing.price,
        image: product.images?.[0]?.image?.url ?? "/placeholder.svg",
        inStock: (product.inventory?.quantity ?? 0) > 0,
        slug: product.slug,
        shortDescription: product.shortDescription,
        comparePrice: product.pricing.comparePrice,
    }))

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                {/* Hero Search */}
                <div className="mb-6 sm:mb-8 mt-16 sm:mt-20">
                    <HeroSearch />
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
                                    Try adjusting your filters or check back later for new additions to our collection.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}