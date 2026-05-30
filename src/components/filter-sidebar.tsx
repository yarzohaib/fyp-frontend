"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FilterSidebarProps, ActiveFilters, Category } from "@/lib/Types"

export function FilterSidebar({ categories = [], onFilterChange, initialCategoryIds = [] }: FilterSidebarProps) {
    const [filters, setFilters] = useState<ActiveFilters>({
        onSale: false,
        inStock: false,
        selectedCategories: initialCategoryIds,
    })

    const handleFilterChange = (newFilters: ActiveFilters) => {
        setFilters(newFilters)
        onFilterChange?.(newFilters)
    }

    const handleOnSaleChange = (checked: boolean) => {
        handleFilterChange({
            ...filters,
            onSale: checked,
        })
    }

    const handleInStockChange = (checked: boolean) => {
        handleFilterChange({
            ...filters,
            inStock: checked,
        })
    }

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const updatedCategories = checked
            ? [...filters.selectedCategories, categoryId]
            : filters.selectedCategories.filter((id) => id !== categoryId)

        handleFilterChange({
            ...filters,
            selectedCategories: updatedCategories,
        })
    }

    return (
        <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="space-y-4 sm:space-y-6 bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0">
                {/* Quick Filters */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 lg:hidden">Filters</h3>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="on-sale"
                            checked={filters.onSale}
                            onCheckedChange={handleOnSaleChange}
                        />
                        <Label htmlFor="on-sale" className="text-xs sm:text-sm font-medium cursor-pointer">
                            On Sale
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="in-stock"
                            checked={filters.inStock}
                            onCheckedChange={handleInStockChange}
                        />
                        <Label htmlFor="in-stock" className="text-xs sm:text-sm font-medium cursor-pointer">
                            In Stock
                        </Label>
                    </div>
                </div>

                {/* Category Filter - Dynamic from Backend */}
                <div>
                    <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-900">Category</h3>
                    <div className="space-y-2">
                        {categories.length > 0 ? (
                            categories.map((category: Category) => (
                                <div key={category.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`category-${category.slug}`}
                                        checked={filters.selectedCategories.includes(category.id)}
                                        // ✅ FIX: Safely check if 'checked' is a boolean before using it
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === 'boolean') {
                                                handleCategoryChange(category.id, checked);
                                            }
                                        }}
                                    />
                                    <Label
                                        htmlFor={`category-${category.slug}`}
                                        className="text-xs sm:text-sm cursor-pointer"
                                    >
                                        {category.name}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs sm:text-sm text-muted-foreground">No categories available</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}