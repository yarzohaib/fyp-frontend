// src/app/products/page.tsx
import ProductsPageClient from '@/components/products-page-client'
import type { Product, Category } from "@/lib/Types"
import { fetchProducts, fetchCategories } from "@/lib/payload"
export const revalidate = 60;

export default async function ProductsPage() {
   

    let initialProducts: Product[] = []
    let categories: Category[] = []

    try {
        const [productsData, categoryData] = await Promise.all([
            fetchProducts(100),
            fetchCategories(100),
        ])

        initialProducts = productsData.docs || []
        categories = categoryData.docs || []
    } catch (error) {
        console.error('Error fetching data:', error)
    }

    return <ProductsPageClient initialProducts={initialProducts} categories={categories} />
}