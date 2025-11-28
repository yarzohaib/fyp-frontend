

import Navbar2 from "@/components/navbar2"
import { HeroSearch } from "@/components/hero-search"
import { FilterSidebar } from "@/components/filter-sidebar"
import { FilterBar } from "@/components/filter-bar"
import { ProductsGrid } from "@/components/product-grid"
import type { ProductCardProps } from "@/components/product-card"
import { Category, Product } from "@/lib/Types"
import { buildImageUrl } from "@/lib/utils"

export default async function ProductsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    console.log('Fetching from:', baseUrl); // Debug log

    let initialProducts: Product[] = [];
    let categories: Category[] = [];

    try {
        // Fetch products and categories from backend
        const [productsRes, categoryRes] = await Promise.all([
            fetch(`${baseUrl}/api/products?limit=100`, {
                cache: "no-store",
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            fetch(`${baseUrl}/api/categories?limit=100`, {
                cache: "no-store",
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ]);

        if (productsRes.ok) {
            const productsData = await productsRes.json();
            initialProducts = productsData.docs || [];
        } else {
            console.error('Products fetch failed:', productsRes.status, productsRes.statusText);
        }

        if (categoryRes.ok) {
            const categoryData = await categoryRes.json();
            categories = categoryData.docs || [];
        } else {
            console.error('Categories fetch failed:', categoryRes.status, categoryRes.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        // Continue with empty arrays - page will show "no products found"
    }

    // Transform backend products to ProductCardProps format
    const transformedProducts: ProductCardProps[] = initialProducts.map((product) => ({
        id: product.id,
        name: product.title,
        price: product.pricing.price,
        image: buildImageUrl(product.images?.[0]?.image?.url, baseUrl) ?? "/placeholder.svg",
        inStock: product.inStock ?? true,
        category: product.category?.name,
        shortDescription: product.shortDescription,
        comparePrice: product.pricing.comparePrice,
        slug: product.slug,
    }));

    return (
        <div className="min-h-screen bg-background">
            <Navbar2 />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Search */}
                <div className="mb-8 mt-20">
                    <HeroSearch />
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <FilterSidebar categories={categories} />

                    {/* Products Section */}
                    <div className="flex-1">
                        <FilterBar resultCount={transformedProducts.length} />
                        {transformedProducts.length > 0 ? (
                            <ProductsGrid products={transformedProducts} />
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500">Check back later for new additions to our collection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}


// import Navbar from "@/components/navbar"
// import { HeroSearch } from "@/components/hero-search"
// import { FilterSidebar } from "@/components/filter-sidebar"
// import { FilterBar } from "@/components/filter-bar"
// import { ProductsGrid } from "@/components/product-grid"
// import type { ProductCardProps } from "@/components/product-card"

// // Mock data - replace with actual API call
// const mockProducts: ProductCardProps[] = [
//     {
//         id: 1,
//         name: "Modern Dining Chair",
//         price: 299,
//         image: "/modern-orange-dining-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 2,
//         name: "Leather Accent Chair",
//         price: 499,
//         image: "/brown-leather-accent-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 3,
//         name: "Velvet Lounge Chair",
//         price: 599,
//         image: "/pink-velvet-lounge-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 4,
//         name: "Green Accent Chair",
//         price: 399,
//         image: "/green-modern-accent-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 5,
//         name: "Minimalist Dining Chair",
//         price: 249,
//         image: "/minimalist-brown-dining-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 6,
//         name: "Designer Armchair",
//         price: 799,
//         image: "/designer-beige-armchair.jpg",
//         inStock: false,
//     },
//     {
//         id: 7,
//         name: "Scandinavian Sofa",
//         price: 1299,
//         image: "/scandinavian-beige-sofa.jpg",
//         inStock: true,
//     },
//     {
//         id: 8,
//         name: "Mid-Century Chair",
//         price: 449,
//         image: "/mid-century-modern-chair.jpg",
//         inStock: true,
//     },
//     {
//         id: 9,
//         name: "Contemporary Armchair",
//         price: 549,
//         image: "/contemporary-white-armchair.jpg",
//         inStock: true,
//     },
// ]

// export default function ProductsPage() {
//     return (
//         <div className="min-h-screen bg-background">
//             <Navbar />

//             <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Hero Search */}
//                 <div className="mb-8">
//                     <HeroSearch />
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex gap-8">
//                     {/* Sidebar Filters */}
//                     <FilterSidebar />

//                     {/* Products Section */}
//                     <div className="flex-1">
//                         <FilterBar resultCount={mockProducts.length} />
//                         <ProductsGrid products={mockProducts} />
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }
