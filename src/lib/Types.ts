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

export interface ProductInventory {
    quantity: number
    lowStockThreshold?: number
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    Description?: string;
    pricing: ProductPricing;
    images?: ProductImage[];
    category?: Category;
    featured?: boolean;
    tags?: string[];
    sku?: string;
    inventory?: ProductInventory;
    createdAt?: string;
    updatedAt?: string;
    colors?: Array<{
        color?: string
        id?: string
    }>
    specifications?: string;
    reviews?: Review[];
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

// ============================================================================
// Auth Types
// ============================================================================

export type UserRole = "customer" | "vendor"
export type UserStatus = "approved" | "pending" | "rejected"

export interface SignupBaseBody {
    email: string
    password: string
    Name: string
}

export type SignupRequestBody =
    | SignupBaseBody
    | (SignupBaseBody & {
        role: "vendor"
        status: UserStatus
        storeName?: string
        storeDescription?: string
    })

export interface AuthUser {
    id: string
    email: string
    role: UserRole
    name: string
    status: UserStatus
}

export interface AuthContextType {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string, role: UserRole) => Promise<void>
    signup: (
        email: string,
        password: string,
        name: string,
        role: UserRole,
        vendorData?: { storeName: string; storeDescription: string },
    ) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

// ============================================================================
// Product Item Types (Unified)
// ============================================================================

export type ProductColor =
    | string
    | {
        id?: string
        name?: string
        hex?: string
        color?: string
        value?: string
    }

// Base product item interface - used by ProductCard, WishlistItem, CartItem
export interface ProductItem {
    id: string | number
    title: string
    price: number
    image: string
    slug?: string
    inStock?: boolean
    inventory?: ProductInventory
}

// ProductCardProps extends ProductItem with additional display properties
export interface ProductCardProps extends ProductItem {
    onSale?: boolean
}

// WishlistItem uses same structure as ProductItem
export type WishlistItem = ProductItem

// CartItem - standalone interface, not extending ProductItem
export interface CartItem {
    id?: string;
    product: string | { id: string };
    quantity: number;
    unitPrice?: number;
    lineTotal?: number;
    color?: string;
}

// RelatedProduct uses same structure as ProductCardProps
export type RelatedProduct = ProductItem & { inStock: boolean }

export interface CarouselProduct {
    id: string | number
    name: string
    price: number
    image: string
    slug?: string
    inStock: boolean
    inventory?: ProductInventory
}

// ============================================================================
// Product Details Types
// ============================================================================

export interface ProductDetailsProps {
    product: {
        id: string
        title: string
        price: number
        comparePrice?: number
        description: string
        inStock: boolean
        colors?: Array<{
            color?: string
            id?: string
        }>
        image?: string
        slug?: string
    }
}

export interface RelatedProductsProps {
    products: RelatedProduct[]
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: "customer" | "vendor"
}

export interface LoginFormProps {
    role: UserRole
}

export interface WishlistButtonProps {
    item: WishlistItem
    className?: string
}

export interface AddToCartButtonProps {
    id: string | number
    title: string
    price: number
    image: string
    slug?: string
    quantity: number
    color?: string
    inStock: boolean
    variant?: 'default' | 'hover'
}

export interface Review {
    id?: string
    user?: string
    rating: number
    comment?: string
    date?: string
}

export interface ProductTabsProps {
    specifications?: string
    reviews?: Review[] | string
}

export interface ProductGalleryProps {
    images: Array<{
        url: string
        alt: string
    }>
}

// ============================================================================
// Vendor & Order Types
// ============================================================================

export interface OrderItem {
    product: string | { id: string; title: string };
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    country: string;
    state: string;
    phone?: string;
}

export interface Customer {
    id: string;
    email: string;
    Name: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    orderStatus: 'pending' | 'delivered' | 'cancelled';
    paymentStatus: string;
    items: OrderItem[];
    total: number;
    createdAt: string;
    customer?: Customer;
    shippingAddress?: ShippingAddress;
}

export interface OrderResponse {
    docs: Order[];
    totalDocs: number;
    limit: number;
    totalPages: number; // <-- ADD THIS
    page: number;
    pagingCounter: number; // <-- ADD THIS
    hasPrevPage: boolean; // <-- ADD THIS
    hasNextPage: boolean; // <-- ADD THIS
    prevPage: number | null; // <-- ADD THIS
    nextPage: number | null; // <-- ADD THIS
}

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
}

export interface BestSellingItem {
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
}

export interface OrderStatusStats {
    pending: number;
    delivered: number;
    cancelled: number;
}

export interface MonthlyRevenuePoint {
    month: string;
    revenue: number;
}

// ============================================================================
// Customer Profile Types
// ============================================================================

export interface CustomerProfile {
    id: string;
    email: string;
    Name: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    addresses?: Address[];
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id?: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}

export interface UpdateProfileRequest {
    Name?: string;
    phone?: string;
    addresses?: Address[];
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface CustomerProfileResponse {
    success: boolean;
    customer: CustomerProfile;
    message?: string;
}

// ============================================================================
// Checkout Types
// ============================================================================

export interface CheckoutItem {
    lineTotal: number;
    product: string;
    productTitle: string;
    vendor?: string;
    quantity: number;
    price: number;
    total: number;
    status?: string;
}

export interface CheckoutShippingAddress {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    phone?: string;
}

export interface CheckoutRequest {
    items?: Array<{
        product: string
        quantity: number
        unitPrice: number
        lineTotal: number
    }>
    shippingAddress: CheckoutShippingAddress
    paymentMethod: string
    paymentStatus: string
    shippingCost: number
    tax: number
}

export interface CheckoutResponse {
    success: boolean;
    order: Order;
    message: string;
}

export interface CartItem {
    id?: string;
    product: string | { id: string };
    quantity: number;
    unitPrice?: number;
    lineTotal?: number;
    color?: string;
}

export interface Cart {
    id: string;
    user: string;
    items: CheckoutItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CartSummary {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    itemCount: number;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface FilterSidebarProps {
    categories: Category[];
    onFilterChange?: (filters: ActiveFilters) => void;
}

export interface ActiveFilters {
    onSale: boolean;
    inStock: boolean;
    selectedCategories: string[];
}

// ============================================================================
// Product Grid Types
// ============================================================================

export interface ProductsGridProps {
    products: ProductCardProps[];
}