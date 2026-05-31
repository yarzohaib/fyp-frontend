import type {
    Product,
    ProductsApiResponse,
    CategoriesApiResponse,
    UserRole,
    SignupRequestBody,
    AuthUser,
    Review,
    DashboardStats,
    OrderResponse,
    OrderStatusStats,
    BestSellingItem,
    MonthlyRevenuePoint,
    CustomerProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    CustomerProfileResponse,
    CheckoutRequest,
    CheckoutResponse,
    Cart,
} from "./Types"

// ============================================================================
// Helper Functions & Constants
// ============================================================================

function getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
}

const BASE_URL = getBaseUrl();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const EMPTY_ORDER_RESPONSE: OrderResponse = {
    docs: [],
    totalDocs: 0,
    limit: 0,
    page: 0,
    totalPages: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
};

// ============================================================================
// Product Fetch Functions
// ============================================================================

/**
 * Fetch products with optional limit
 */
export async function fetchProducts(limit?: number): Promise<ProductsApiResponse> {
    const limitParam = limit ? `?limit=${limit}` : ""

    const response = await fetch(`${BASE_URL}/api/public-products${limitParam}`, {
        next: { revalidate: 60 }, // ✅ Changed from cache: "no-store"
        headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`)
    }

    return response.json()
}

/**
 * Fetch a single product by slug or ID
 */
export async function fetchProductBySlugOrId(slugOrId: string, depth: number = 2): Promise<Product | null> {
    const depthParam = `&depth=${depth}`
    try {
        // Try fetching by slug first
        let res = await fetch(`${BASE_URL}/api/public-products?where[slug][equals]=${slugOrId}${depthParam}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            if (data.docs?.[0]) {
                return data.docs[0]
            }
        }

        // If slug lookup fails, try fetching by ID
        res = await fetch(`${BASE_URL}/api/public-products?where[id][equals]=${slugOrId}${depthParam}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            return data.docs?.[0] || null
        }

        return null
    } catch (error) {
        console.error("Error fetching product:", error)
        return null
    }
}

/**
 * Fetch related products by category ID
 */
export async function fetchRelatedProducts(
    categoryId: string,
    currentProductId: string,
    limit: number = 3
): Promise<Product[]> {
    try {
        const res = await fetch(
            `${BASE_URL}/api/products?where[category][equals]=${categoryId}&limit=${limit}`,
            {
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        if (!res.ok) return []

        const data = await res.json()
        return (data.docs || []).filter((p: Product) => p.id !== currentProductId)
    } catch (error) {
        console.error("Error fetching related products:", error)
        return []
    }
}

/**
 * Fetch reviews for a specific product
 */
export async function fetchProductReviews(productId: string): Promise<Review[]> {
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const res = await fetch(
            `${BASE_URL}/api/reviews?where[product][equals]=${productId}`,
            {
                next: { revalidate: 300 },
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
            }
        )

        clearTimeout(timeout)

        if (!res.ok) return []

        const data = await res.json()
        return data.docs || []
    } catch {
        return []
    }
}

/**
 * Fetch a single product by slug or ID with reviews
 */
export async function fetchProductBySlugOrIdWithReviews(slugOrId: string): Promise<Product | null> {
    try {
        // Try fetching by slug first
        let res = await fetch(`${BASE_URL}/api/public-products?where[slug][equals]=${slugOrId}&depth=2`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            if (data.docs?.[0]) {
                const product = data.docs[0]
                const reviews = await fetchProductReviews(product.id)
                return { ...product, reviews }
            }
        }

        // If slug lookup fails, try fetching by ID
        res = await fetch(`${BASE_URL}/api/public-products?where[id][equals]=${slugOrId}&depth=2`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json()
            if (data.docs?.[0]) {
                const product = data.docs[0]
                const reviews = await fetchProductReviews(product.id)
                return { ...product, reviews }
            }
        }

        return null
    } catch (error) {
        console.error("Error fetching product:", error)
        return null
    }
}

// ============================================================================
// Vendor Public Fetch Functions
// ============================================================================

/**
 * Fetch all publicly visible products belonging to a vendor.
 * depth=2 ensures the vendor object is embedded in each product so we can
 * extract store name, logo, and description from products[0].vendor.
 */
export async function fetchPublicVendorProducts(vendorId: string, limit: number = 50): Promise<Product[]> {
    try {
        const res = await fetch(
            `${BASE_URL}/api/public-products?vendor=${vendorId}&limit=${limit}&depth=2`,
            {
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
            }
        )
        if (!res.ok) return []
        const data = await res.json()
        return data.docs || []
    } catch {
        return []
    }
}

// ============================================================================
// Category Fetch Functions
// ============================================================================

/**
 * Fetch categories with optional limit
 */
export async function fetchCategories(limit?: number): Promise<CategoriesApiResponse> {
    const limitParam = limit ? `?limit=${limit}` : ""

    const response = await fetch(`${BASE_URL}/api/public-categories${limitParam}`, {
        next: { revalidate: 60 }, // ✅ Changed from cache: "no-store"
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch categories (${response.status})`)
    }

    return response.json()
}

// ============================================================================
// Auth Fetch Functions
// ============================================================================

export interface LoginResponse {
    token: string
    user: AuthUser
}

/**
 * Login user
 */
export async function loginUser(
    email: string,
    password: string,
    role: UserRole
): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/api/${role}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    return response.json()
}

/**
 * Register/Signup user
 */
export async function signupUser(
    email: string,
    password: string,
    name: string,
    role: UserRole,
    vendorData?: { storeName: string; storeDescription: string }
): Promise<LoginResponse> {
    let body: SignupRequestBody = { email, password, Name: name }

    if (role === "vendor") {
        body = {
            ...body,
            role: "vendor",
            status: "pending",
            storeName: vendorData?.storeName,
            storeDescription: vendorData?.storeDescription,
        }
    }

    const response = await fetch(`${BASE_URL}/api/${role}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.message || "Signup failed")
    }

    return response.json()
}

// ============================================================================
// Vendor Specific - Orders Cache & Fetch
// ============================================================================

let ordersCache: OrderResponse = { ...EMPTY_ORDER_RESPONSE };
let ordersCacheTime: number = 0;


//   Fetch all vendor orders with caching
 
async function fetchVendorOrdersData(): Promise<OrderResponse> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        return { ...EMPTY_ORDER_RESPONSE };
    }

    // Return cached data if still valid
    const now = Date.now();
    if (ordersCache.totalDocs > 0 && (now - ordersCacheTime) < CACHE_DURATION) {
        return ordersCache;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/orders?limit=0`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.docs)) {
                ordersCache = data;
                ordersCacheTime = now;
                return ordersCache;
            }
        }
    } catch (err) {
        console.error("Error fetching orders:", err);
    }

    return { ...EMPTY_ORDER_RESPONSE };
}

/**
 * Clear orders cache (call after order updates)
 */
export function clearOrdersCache(): void {
    ordersCache = { ...EMPTY_ORDER_RESPONSE };
    ordersCacheTime = 0;
}

// ============================================================================
// Dashboard Stats Functions
// ============================================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;

        if (!token || !storedUser) {
            throw new Error("Vendor not authenticated");
        }

        const authUser: AuthUser = JSON.parse(storedUser);
        const vendorId = authUser.id;

        // Fetch products
        const productsResponse = await fetch(`${BASE_URL}/api/public-products?vendor=${vendorId}`);
        if (!productsResponse.ok) {
            throw new Error("Failed to fetch products");
        }

        const productsData = await productsResponse.json();

        // Fetch orders using shared function
        const ordersData = await fetchVendorOrdersData();

        // Calculate monthly and yearly revenue
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let monthlyRevenue = 0;
        let yearlyRevenue = 0;

        ordersData.docs.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            if (orderYear === currentYear) {
                yearlyRevenue += order.total;
                if (orderMonth === currentMonth) {
                    monthlyRevenue += order.total;
                }
            }
        });

        return {
            totalProducts: productsData.totalDocs || 0,
            totalOrders: ordersData.totalDocs || 0,
            monthlyRevenue: Math.round(monthlyRevenue),
            yearlyRevenue: Math.round(yearlyRevenue),
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
}

/**
 * Get order status counts
 */
export async function getOrderStatus(): Promise<OrderStatusStats> {
    const ordersData = await fetchVendorOrdersData();

    if (!ordersData?.docs) {
        return { pending: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, canceled: 0 };
    }

    const stats: OrderStatusStats = {
        pending: 0,
        paid: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        canceled: 0,
    };

    ordersData.docs.forEach((order) => {
        if (order.orderStatus && stats[order.orderStatus] !== undefined) {
            stats[order.orderStatus]++;
        }
    });

    return stats;
}

/**
 * Get best selling products
 */
export async function getBestSelling(): Promise<BestSellingItem[]> {
    const ordersData = await fetchVendorOrdersData();

    if (!ordersData?.docs?.length) return [];

    const productMap = new Map<
        string,
        { name: string; totalSold: number; revenue: number }
    >();

    ordersData.docs.forEach((order) => {
        (order.items || []).forEach((item) => {
            if (!item.product) return;

            const productId = typeof item.product === 'object' ? item.product.id : item.product;
            const productName = typeof item.product === 'object' ? item.product.title : productId;

            const existing = productMap.get(productId) || { 
                name: productName, 
                totalSold: 0, 
                revenue: 0 
            };
            
            existing.totalSold += item.quantity || 0;
            existing.revenue += (item.price || 0) * (item.quantity || 0);
            
            productMap.set(productId, existing);
        });
    });

    return Array.from(productMap.entries())
        .map(([productId, stats]) => ({
            productId,
            name: stats.name,
            totalSold: stats.totalSold,
            revenue: stats.revenue,
        }))
        .sort((a, b) => b.totalSold - a.totalSold);
}

/**
 * Get monthly revenue chart data
 */
export async function getMonthlyRevenueChart(): Promise<MonthlyRevenuePoint[]> {
    const ordersData = await fetchVendorOrdersData();

    if (!ordersData?.docs) return [];

    const months = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    ordersData.docs.forEach((order) => {
        const date = new Date(order.createdAt);
        if (date.getFullYear() === currentYear) {
            const monthIndex = date.getMonth();
            months[monthIndex] += order.total || 0;
        }
    });

    return months.map((revenue, index) => ({
        month: new Date(currentYear, index).toLocaleString("en", { month: "short" }),
        revenue,
    }));
}

/**
 * Fetch paginated orders for vendor orders page
 */
export async function fetchVendorOrders(page: number = 1, limit: number = 10): Promise<OrderResponse> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    const url = `${BASE_URL}/api/orders?page=${page}&limit=${limit}&depth=2`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch vendor orders:", response.status);
            return { ...EMPTY_ORDER_RESPONSE, limit, page };
        }

        return response.json();
    } catch (err) {
        console.error("Error fetching vendor orders:", err);
        return { ...EMPTY_ORDER_RESPONSE, limit, page };
    }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
    orderId: string,
    newStatus: string
): Promise<boolean> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    const url = `${BASE_URL}/api/orders/${orderId}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
            body: JSON.stringify({ orderStatus: newStatus }),
        });

        if (response.ok) {
            clearOrdersCache();
            return true;
        }
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error ?? `Failed to update status (${response.status})`)
    } catch (err) {
        console.error("Error updating order status:", err);
        throw err;
    }
}

/**
 * Fetch customer profile
 */
export async function fetchCustomerProfile(): Promise<CustomerProfile | null> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await fetch(`${BASE_URL}/api/customer/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        return data.customer || null;
    } catch (error) {
        console.error("Error fetching customer profile:", error);
        throw error;
    }
}

/**
 * Update customer profile
 */
export async function updateCustomerProfile(
    updateData: UpdateProfileRequest
): Promise<CustomerProfileResponse> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await fetch(`${BASE_URL}/api/customer/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error updating customer profile:", error);
        throw error;
    }
}

/**
 * Change customer password
 */
export async function changeCustomerPassword(
    changePasswordData: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await fetch(`${BASE_URL}/api/customer/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
            body: JSON.stringify(changePasswordData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to change password: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}

/**
 * Fetch customer orders by customer ID
 */
export async function fetchCustomerOrders(
    customerId: string,
    page: number = 1,
    limit: number = 10,
): Promise<OrderResponse> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    const url = `${BASE_URL}/api/orders/user/${customerId}?page=${page}&limit=${limit}&depth=2`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch customer orders:", response.status);
            return { ...EMPTY_ORDER_RESPONSE, limit, page };
        }

        return response.json();
    } catch (err) {
        console.error("Error fetching customer orders:", err);
        return { ...EMPTY_ORDER_RESPONSE, limit, page };
    }
}

/**
 * Fetch cart for current user
 */
export async function fetchUserCart(): Promise<Cart | null> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await fetch(`${BASE_URL}/api/customer/cart`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.cart || null;
    } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
    }
}

/**
 * Process checkout and create order
 */
export async function processCheckout(
    checkoutData: CheckoutRequest,
): Promise<CheckoutResponse> {
    const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('authToken') || localStorage.getItem('token'))
        : null;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        console.log('=== CHECKOUT DEBUG ===');
        console.log('Full checkout data:', JSON.stringify(checkoutData, null, 2));
        console.log('Shipping address:', checkoutData.shippingAddress);
        console.log('Items count:', checkoutData.items?.length);
        
        const response = await fetch(`${BASE_URL}/api/customer/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
            },
            body: JSON.stringify(checkoutData),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { error: responseText };
            }
            console.error('Checkout error response:', errorData);
            throw new Error(errorData.error || `Failed to process checkout: ${response.status}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error processing checkout:", error);
        throw error;
    }
}