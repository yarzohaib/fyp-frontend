export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductImage {
    image: {
        id: string;
        url: string;
        alt?: string;
        filename?: string;
        mimeType?: string;
        filesize?: number;
        width?: number;
        height?: number;
    };
    id?: string;
}

export interface ProductPricing {
    price: number;
    comparePrice?: number;
    currency?: string;
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    pricing: ProductPricing;
    images?: ProductImage[];
    category?: Category;
    inStock?: boolean;
    featured?: boolean;
    tags?: string[];
    sku?: string;
    inventory?: number;
    createdAt?: string;
    updatedAt?: string;
}

// API Response types
export interface ProductsApiResponse {
    docs: Product[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface CategoriesApiResponse {
    docs: Category[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface FilterOptions {
    onSale: boolean
    inStock: boolean
    sizes: string[]
    materials: string[]
    categories: string[]
    colors: string[]
    rooms: string[]
    collections: string[]
}
