import { ProductCard } from "./product-card"
import type { ProductsGridProps } from "@/lib/Types"

export function ProductsGrid({ products }: ProductsGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    )
}
