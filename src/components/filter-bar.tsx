'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { Category, ActiveFilters } from '@/lib/Types'

interface FilterBarProps {
    categories: Category[]
    initialCategoryIds?: string[]
    onFilterChange?: (filters: ActiveFilters) => void
}

export function FilterBar({ categories, initialCategoryIds = [], onFilterChange }: FilterBarProps) {
    const [filters, setFilters] = useState<ActiveFilters>({
        onSale: false,
        inStock: false,
        selectedCategories: initialCategoryIds,
    })

    const update = (next: ActiveFilters) => {
        setFilters(next)
        onFilterChange?.(next)
    }

    const toggleCategory = (id: string) => {
        const has = filters.selectedCategories.includes(id)
        update({
            ...filters,
            selectedCategories: has
                ? filters.selectedCategories.filter(c => c !== id)
                : [...filters.selectedCategories, id],
        })
    }

    const activeCount =
        (filters.onSale ? 1 : 0) +
        (filters.inStock ? 1 : 0) +
        filters.selectedCategories.length

    const pillCls = (active: boolean) =>
        `inline-flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-[0.07em] uppercase border transition-all duration-200 cursor-pointer select-none shrink-0 ${
            active
                ? 'bg-[#1A3126] text-white border-[#1A3126]'
                : 'bg-white text-[#1A3126]/65 border-[#1A3126]/20 hover:border-[#1A3126]/60 hover:text-[#1A3126]'
        }`

    return (
        <div className="flex items-center gap-2 py-3.5 overflow-x-auto scrollbar-hide">
            <button
                onClick={() => update({ ...filters, onSale: !filters.onSale })}
                className={pillCls(filters.onSale)}
            >
                On Sale
            </button>
            <button
                onClick={() => update({ ...filters, inStock: !filters.inStock })}
                className={pillCls(filters.inStock)}
            >
                In Stock
            </button>

            {categories.length > 0 && (
                <span className="w-px h-4 bg-gray-200 mx-1 shrink-0" />
            )}

            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={pillCls(filters.selectedCategories.includes(cat.id))}
                >
                    {cat.name}
                </button>
            ))}

            {activeCount > 0 && (
                <button
                    onClick={() => update({ onSale: false, inStock: false, selectedCategories: [] })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold tracking-[0.07em] uppercase text-[#BB4E2C] border border-[#BB4E2C]/30 hover:border-[#BB4E2C] transition-colors duration-200 shrink-0"
                >
                    <X className="w-3 h-3" />
                    Clear
                </button>
            )}
        </div>
    )
}
