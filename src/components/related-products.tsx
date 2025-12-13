import type { RelatedProductsProps } from "@/lib/Types"
import { ProductCard } from "./product-card" 

export function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Other Products You Might Like</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        {...product}
                        // Defaulting onSale to false, as the RelatedProduct type is ProductItem, not Product.
                        // If the product is truly on sale, its data object must be extended to reflect this.
                        onSale={false} 
                    />
                ))}
            </div>
        </div>
    )
}