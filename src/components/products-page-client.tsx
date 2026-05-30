'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from "@/components/navbar"
import { FilterBar } from "@/components/filter-bar"
import { ProductsGrid } from "@/components/product-grid"
import { HeroSearch } from "@/components/hero-search"
import type { ProductCardProps, Category, Product, ActiveFilters } from "@/lib/Types"

interface ProductsPageProps {
    initialProducts: Product[]
    categories: Category[]
    initialCategoryName?: string
}

export default function ProductsPageClient({ initialProducts, categories, initialCategoryName }: ProductsPageProps) {
    const initialCategoryIds = useMemo(() => {
        if (!initialCategoryName) return []
        const match = categories.find(
            (c) => c.name.toLowerCase() === initialCategoryName.toLowerCase()
        )
        return match ? [match.id] : []
    }, [initialCategoryName, categories])

    const [filters, setFilters] = useState<ActiveFilters>({
        onSale: false,
        inStock: false,
        selectedCategories: initialCategoryIds,
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const PAGE_SIZE = 50

    // Reset to page 1 whenever filters or search change
    useEffect(() => { setCurrentPage(1) }, [filters, searchQuery])

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchesTitle = product.title.toLowerCase().includes(q)
                const matchesDesc =
                    product.Description?.toLowerCase().includes(q) ||
                    product.shortDescription?.toLowerCase().includes(q)
                if (!matchesTitle && !matchesDesc) return false
            }
            if (filters.onSale && !product.pricing.discountedPrice) return false
            if (filters.inStock && (product.inventory?.quantity ?? 0) <= 0) return false
            if (filters.selectedCategories.length > 0) {
                const productCategoryId =
                    typeof product.category === 'object' ? product.category?.id : product.category
                if (!productCategoryId || !filters.selectedCategories.includes(productCategoryId)) return false
            }
            return true
        })
    }, [initialProducts, filters, searchQuery])

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
    const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const transformedProducts: ProductCardProps[] = pagedProducts.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.pricing.price,
        discountedPrice: product.pricing.discountedPrice,
        image: product.images?.[0]?.image?.url ?? "/placeholder.svg",
        secondImage: product.images?.[1]?.image?.url,
        inStock: (product.inventory?.quantity ?? 0) > 0,
        slug: product.slug,
        shortDescription: product.shortDescription,
    }))

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
                {/* Hero Search */}
                <div className="mt-24 sm:mt-28">
                    <HeroSearch value={searchQuery} onSearch={setSearchQuery} />
                </div>

                {/* Filter Bar */}
                <div className="border-b border-gray-100">
                    <FilterBar
                        categories={categories}
                        initialCategoryIds={initialCategoryIds}
                        onFilterChange={setFilters}
                    />
                </div>

                {/* Results count */}
                <p className="text-xs text-gray-400 mt-4 mb-5">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    {searchQuery && (
                        <span className="ml-1">
                            for <span className="font-medium text-gray-700">&ldquo;{searchQuery}&rdquo;</span>
                        </span>
                    )}
                    {totalPages > 1 && (
                        <span className="ml-2 text-gray-300">— page {currentPage} of {totalPages}</span>
                    )}
                </p>

                {/* Products grid or empty state */}
                {transformedProducts.length > 0 ? (
                    <ProductsGrid products={transformedProducts} />
                ) : (
                    <div className="text-center py-20 px-4">
                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-[#1A3126] mb-2">No products found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery
                                ? `No results for "${searchQuery}". Try a different search term.`
                                : 'Try adjusting your filters or check back later.'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between py-10 border-t border-gray-100 mt-8">
                        <button
                            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium text-[#1A3126] hover:border-[#1A3126] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                    className={`w-9 h-9 text-sm font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-[#1A3126] text-white'
                                            : 'border border-gray-200 text-[#1A3126] hover:border-[#1A3126]'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium text-[#1A3126] hover:border-[#1A3126] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}

                <div className="pb-8" />
            </main>
        </div>
    )
}
