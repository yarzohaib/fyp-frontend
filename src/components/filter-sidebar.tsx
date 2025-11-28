// "use client"

// import { useState } from "react"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"

// export function FilterSidebar() {
//     const [filters, setFilters] = useState({
//         onSale: false,
//         inStock: false,
//     })

//     return (
//         <aside className="w-64 flex-shrink-0">
//             <div className="space-y-6">
//                 {/* Quick Filters */}
//                 <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                         <Checkbox
//                             id="on-sale"
//                             checked={filters.onSale}
//                             onCheckedChange={(checked) => setFilters({ ...filters, onSale: checked as boolean })}
//                         />
//                         <Label htmlFor="on-sale" className="text-sm font-medium cursor-pointer">
//                             On Sale
//                         </Label>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Checkbox
//                             id="in-stock"
//                             checked={filters.inStock}
//                             onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked as boolean })}
//                         />
//                         <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
//                             In Stock
//                         </Label>
//                     </div>
//                 </div>

//                 {/* Size Filter */}
//                 <div>
//                     <h3 className="text-sm font-semibold mb-3">Size</h3>
//                     <div className="space-y-2">
//                         {["Small", "Medium", "Large"].map((size) => (
//                             <div key={size} className="flex items-center gap-2">
//                                 <Checkbox id={`size-${size.toLowerCase()}`} />
//                                 <Label htmlFor={`size-${size.toLowerCase()}`} className="text-sm cursor-pointer">
//                                     {size}
//                                 </Label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Material Filter */}
//                 <div>
//                     <h3 className="text-sm font-semibold mb-3">Material</h3>
//                     <div className="space-y-2">
//                         {["Wood", "Metal", "Fabric", "Leather"].map((material) => (
//                             <div key={material} className="flex items-center gap-2">
//                                 <Checkbox id={`material-${material.toLowerCase()}`} />
//                                 <Label htmlFor={`material-${material.toLowerCase()}`} className="text-sm cursor-pointer">
//                                     {material}
//                                 </Label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Category Filter */}
//                 <div>
//                     <h3 className="text-sm font-semibold mb-3">Category</h3>
//                     <div className="space-y-2">
//                         {["Chairs", "Tables", "Sofas", "Beds", "Storage"].map((category) => (
//                             <div key={category} className="flex items-center gap-2">
//                                 <Checkbox id={`category-${category.toLowerCase()}`} />
//                                 <Label htmlFor={`category-${category.toLowerCase()}`} className="text-sm cursor-pointer">
//                                     {category}
//                                 </Label>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </aside>
//     )
// }

"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Category } from "@/lib/Types"

interface FilterSidebarProps {
    categories?: Category[]
}

export function FilterSidebar({ categories = [] }: FilterSidebarProps) {
    const [filters, setFilters] = useState({
        onSale: false,
        inStock: false,
    })

    return (
        <aside className="w-64 flex-shrink-0">
            <div className="space-y-6">
                {/* Quick Filters */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="on-sale"
                            checked={filters.onSale}
                            onCheckedChange={(checked) => setFilters({ ...filters, onSale: checked as boolean })}
                        />
                        <Label htmlFor="on-sale" className="text-sm font-medium cursor-pointer">
                            On Sale
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="in-stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked as boolean })}
                        />
                        <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
                            In Stock
                        </Label>
                    </div>
                </div>

                {/* Size Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">Size</h3>
                    <div className="space-y-2">
                        {["Small", "Medium", "Large"].map((size) => (
                            <div key={size} className="flex items-center gap-2">
                                <Checkbox id={`size-${size.toLowerCase()}`} />
                                <Label htmlFor={`size-${size.toLowerCase()}`} className="text-sm cursor-pointer">
                                    {size}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Material Filter */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">Material</h3>
                    <div className="space-y-2">
                        {["Wood", "Metal", "Fabric", "Leather"].map((material) => (
                            <div key={material} className="flex items-center gap-2">
                                <Checkbox id={`material-${material.toLowerCase()}`} />
                                <Label htmlFor={`material-${material.toLowerCase()}`} className="text-sm cursor-pointer">
                                    {material}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filter - Dynamic from Backend */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">Category</h3>
                    <div className="space-y-2">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <div key={category.id} className="flex items-center gap-2">
                                    <Checkbox id={`category-${category.slug}`} />
                                    <Label htmlFor={`category-${category.slug}`} className="text-sm cursor-pointer">
                                        {category.name}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No categories available</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}