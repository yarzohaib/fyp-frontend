// import { ProductCard, type ProductCardProps } from "./product-card"

// interface ProductsGridProps {
//     products: ProductCardProps[]
// }

// export function ProductsGrid({ products }: ProductsGridProps) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//                 <ProductCard key={product.id} {...product} />
//             ))}
//         </div>
//     )
// }

import { ProductCard, type ProductCardProps } from "./product-card"

interface ProductsGridProps {
    products: ProductCardProps[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {products.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    )
}