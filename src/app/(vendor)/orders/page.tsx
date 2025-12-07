"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchVendorOrders, updateOrderStatus } from "@/lib/payload";
import type { Order } from "@/lib/Types";
import { Mail, MapPin, Package, Calendar, Loader2 } from "lucide-react";

const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
] as Array<{ label: string; value: string }>;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<string>("all");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchVendorOrders(currentPage, 10);
      setOrders(data.docs);
      setTotalPages(Math.ceil(data.totalDocs / 10));
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, orderStatus: newStatus as Order["orderStatus"] } : order
          )
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F2F0E5" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1A3126" }}>
            Order Management
          </h1>
          <p style={{ color: "#666" }}>
            Manage and track orders received from your customers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#1A3126" }}
                >
                  {orders.length}
                </div>
                <p className="text-sm" style={{ color: "#666" }}>
                  Total Orders
                </p>
              </div>
            </CardContent>
          </Card>

          {ORDER_STATUS_OPTIONS.map((status) => (
            <Card key={status.value} className="rounded-xl shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#1A3126" }}
                  >
                    {orders.filter((o) => o.orderStatus === status.value).length}
                  </div>
                  <p className="text-sm" style={{ color: "#666" }}>
                    {status.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className="rounded-lg"
            style={
              filter === "all"
                ? { backgroundColor: "#BB4E2C", color: "white" }
                : {}
            }
          >
            All Orders
          </Button>
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              variant={filter === opt.value ? "default" : "outline"}
              className="rounded-lg"
              style={
                filter === opt.value
                  ? { backgroundColor: "#BB4E2C", color: "white" }
                  : {}
              }
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="rounded-xl shadow-md">
            <CardContent className="pt-12 pb-12 flex justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p style={{ color: "#666" }}>Loading orders...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <Card className="rounded-xl shadow-md">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4" style={{ color: "#999" }} />
              <p style={{ color: "#1A3126" }} className="font-medium">
                No orders found
              </p>
              <p style={{ color: "#666" }} className="text-sm mt-1">
                {filter !== "all"
                  ? `No orders with status "${filter}"`
                  : "You haven't received any orders yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="rounded-xl shadow-md overflow-hidden">
              <CardHeader className="pb-3" style={{ backgroundColor: "#F9F7F2" }}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg" style={{ color: "#1A3126" }}>
                      Order {order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Calendar size={14} style={{ color: "#999" }} />
                      <span style={{ color: "#666" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={`rounded-full px-3 py-1 ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                {/* Customer Info */}
                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                  <h3 className="font-semibold mb-3" style={{ color: "#1A3126" }}>
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#666" }}>
                        {order.customer?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} style={{ color: "#BB4E2C" }} />
                      <a
                        href={`mailto:${order.customer?.email}`}
                        style={{ color: "#BB4E2C" }}
                        className="hover:underline"
                      >
                        {order.customer?.email || "N/A"}
                      </a>
                    </div>
                    {order.shippingAddress && (
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                        <MapPin size={14} style={{ color: "#999", marginTop: "2px" }} />
                        <div style={{ color: "#666", fontSize: "13px" }}>
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          <br />
                          {order.shippingAddress.state}, 
                          {order.shippingAddress.street}
                          <br />
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                          {order.shippingAddress.phone && (
                            <>
                              <br />
                              {order.shippingAddress.phone}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3" style={{ color: "#1A3126" }}>
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <div>
                          <p style={{ color: "#1A3126" }} className="font-medium">
                            {typeof item.product === "object"
                              ? item.product.title
                              : item.product}
                          </p>
                          <p style={{ color: "#999" }}>
                            Qty: {item.quantity} × PKR {item.price.toFixed(2)}
                          </p>
                        </div>
                        <p style={{ color: "#1A3126" }} className="font-semibold">
                          PKR {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2 text-sm">
                    <span style={{ color: "#666" }}>Subtotal:</span>
                    <span style={{ color: "#1A3126" }} className="font-medium">
                      PKR {(order.total * 0.85).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: "#1A3126" }}>Total:</span>
                    <span style={{ color: "#BB4E2C" }}>
                      PKR {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    style={{ minWidth: "150px" }}
                  >
                    {ORDER_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {updating === order.id && (
                    <div className="flex items-center gap-2" style={{ color: "#BB4E2C" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Updating...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="rounded-lg"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                className="rounded-lg"
                style={
                  currentPage === page
                    ? { backgroundColor: "#BB4E2C", color: "white" }
                    : {}
                }
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="rounded-lg"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
