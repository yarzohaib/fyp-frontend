"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import AddProductForm from "@/components/vendor/AddProductForm";

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
    <div className="min-h-screen p-6 bg-[#F2F0E5]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1A3126]">Your Products</h1>
          <Button 
          onClick={() => setShowAddForm(true)}
          className="font-semibold rounded-xl px-4 py-2 bg-[#BB4E2C] hover:bg-[#A03D1F] text-white">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && <p className="text-[#1A3126]">Loading products...</p>}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl font-semibold mb-2 text-[#1A3126]">No products found</p>
            <p className="text-gray-600 mb-4">Start by adding your first product to your store</p>
            <Button className="font-semibold rounded-xl px-6 py-2 bg-[#BB4E2C] hover:bg-[#A03D1F] text-white">
              <Plus size={16} className="mr-2" /> Add Your First Product
            </Button>
          </div>
        )}

        {/* Product List */}
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="flex items-center p-4 rounded-xl shadow-md bg-white">
              {/* Product Image */}
              <Image
                src={product.images[0]?.image?.url || "/placeholder.png"}
                width={96}
                height={96}
                alt={product.title}
                className="w-24 h-24 rounded-xl object-cover mr-4"
              />

              {/* Product Info */}
              <CardContent className="flex-1 p-0">
                <h2 className="text-xl font-semibold text-[#1A3126]">{product.title}</h2>
                <p className="font-medium">PKR {product.pricing.price}</p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    product.inventory.quantity > 0 ? "text-[#1A3126]" : "text-[#BB4E2C]"
                  }`}
                >
                  {product.inventory.quantity > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </CardContent>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => toggleStock(product.id)}
                  className="px-3 py-1 rounded-lg text-sm text-white"
                  style={{
                    backgroundColor: product.inventory.quantity > 0 ? "#1A3126" : "#BB4E2C",
                  }}
                >
                  {product.inventory.quantity > 0 ? "Mark Out of Stock" : "Mark In Stock"}
                </Button>

                <Button
                  onClick={() => deleteProduct(product.id)}
                  className="px-3 py-1 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              loadProducts(); // Reload products after successful creation
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}