"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import AddProductForm from "@/components/vendor/AddProductForm";
export const dynamic = 'force-dynamic'
// ===========================
// INTERFACES
// ===========================

interface ProductImageFile {
  url: string;
  alt: string;
}

interface ProductImage {
  id: string;
  alt: string;
  image: ProductImageFile;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductVendor {
  id: string;
  storeName: string;
  slug: string;
}

interface ProductPricing {
  price: number;
}

interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  pricing: ProductPricing;
  inventory: ProductInventory;
  images: ProductImage[];
  category: ProductCategory;
  vendor: ProductVendor;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ===========================
// CONSTANTS
// ===========================

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const TOKEN_KEYS = ["authToken", "token", "jwt", "accessToken", "payload-token"];

// ===========================
// HELPER FUNCTIONS
// ===========================

const getAuthToken = (): string | null => {
  // Check localStorage
  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }

  // Check cookies
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (TOKEN_KEYS.includes(name) || name.includes("token")) {
      return value;
    }
  }

  return null;
};

// ===========================
// MAIN COMPONENT
// ===========================

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false); 

  // Fetch products
  const loadProducts = async (page = 1, limit = 10, status = "all"): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${BACKEND_URL}/api/vendor/products?page=${page}&limit=${limit}&status=${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }

      const data: ProductsResponse = await res.json();
      setProducts(data.docs || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle stock status
  const toggleStock = async (id: string): Promise<void> => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              inventory: {
                ...p.inventory,
                quantity: p.inventory.quantity > 0 ? 0 : 10,
              },
            }
          : p
      )
    );
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/vendor/products?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ===========================
  // RENDER
  // ===========================

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3126' }}>Your Products</h1>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="font-semibold rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
            style={{ backgroundColor: '#BB4E2C' }}
          >
            <Plus size={18} className="mr-2" /> Add Product
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-white font-medium text-sm sm:text-base" style={{ backgroundColor: '#BB4E2C' }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto mb-3 sm:mb-4" style={{ borderColor: '#BB4E2C' }}></div>
            <p className="text-sm sm:text-base" style={{ color: '#1A3126' }}>Loading products...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
            <CardContent className="text-center py-12 sm:py-16 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#BB4E2C' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#1A3126' }}>No products found</h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: '#1A3126', opacity: 0.6 }}>Start by adding your first product to your store</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="font-semibold rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
                style={{ backgroundColor: '#BB4E2C' }}
              >
                <Plus size={18} className="mr-2" /> Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
                  <Image
                    src={product.images[0]?.image?.url || "/placeholder.png"}
                    width={120}
                    height={120}
                    alt={product.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                  <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2" style={{ color: '#1A3126' }}>
                    {product.title}
                  </h2>
                  <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2" style={{ color: '#BB4E2C' }}>
                    Rs. {product.pricing.price.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold" style={{ 
                    color: product.inventory.quantity > 0 ? '#1A3126' : '#BB4E2C' 
                  }}>
                    {product.inventory.quantity > 0 ? '● In Stock' : '● Out of Stock'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => toggleStock(product.id)}
                    className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto"
                    style={{
                      backgroundColor: product.inventory.quantity > 0 ? '#1A3126' : '#BB4E2C',
                    }}
                  >
                    {product.inventory.quantity > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </Button>

                  <Button
                    onClick={() => deleteProduct(product.id)}
                    className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto"
                    style={{ 
                      backgroundColor: '#BB4E2C',
                      color: 'white'
                    }}
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              loadProducts();
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}