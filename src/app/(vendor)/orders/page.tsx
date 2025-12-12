"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchVendorOrders, updateOrderStatus } from "@/lib/payload";
import type { Order } from "@/lib/Types";
import { Mail, MapPin, Package, Calendar, Loader2, Phone, User, ChevronDown, TrendingUp } from "lucide-react";


const COLOR_BACKGROUND = "#F2F0E5";
const COLOR_PRIMARY = "#1A3126";
const COLOR_ACCENT = "#BB4E2C";

// Light/Muted versions for status badges.
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-800 border-yellow-300",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-300",cancelled: "bg-blue-50 text-blue-800 border-blue-300",
};

const ORDER_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
] as Array<{ label: string; value: string }>;

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
      setTotalPages(data.totalPages || 1);
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
    return STATUS_COLORS[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  return (
    // Background: #F2F0E5
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 lg:p-8`} style={{ backgroundColor: COLOR_BACKGROUND }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Simplified, using Primary/Accent colors */}
        <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: COLOR_ACCENT }}>
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              {/* Heading: font-serif, font-medium, Primary color */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium" style={{ color: COLOR_PRIMARY }}>
                Order Management
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Track and manage your customer orders
              </p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards - Simplified, based on the image provided */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          
          {/* Total Orders Card - Accent Primary color mix */}
          <Card className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div style={{ backgroundColor: COLOR_ACCENT }} className="text-white p-3 sm:p-4 flex items-center justify-between">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                <div>
                    <div className="text-xl sm:text-2xl font-bold text-right">{orders.length}</div>
                    <p className="text-xs font-medium opacity-90">Total Orders</p>
                </div>
            </div>
          </Card>

          {/* Status Cards - Muted, aligned with image colors */}
          {ORDER_STATUS_OPTIONS.map((status, idx) => {
            const count = orders.filter((o) => o.orderStatus === status.value).length;
            
            const statusBgColor = idx === 0 ? 'bg-amber-600' : idx === 1 ? 'bg-emerald-600' : 'bg-rose-600';
            const statusLabel = status.label;

            return (
              <Card key={status.value} className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className={`${statusBgColor} text-white p-3 sm:p-4 flex items-center justify-between`}>
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                    <div>
                        <div className="text-xl sm:text-2xl font-bold text-right">{count}</div>
                        <p className="text-xs font-medium opacity-90">{statusLabel}</p>
                    </div>
                </div>
              </Card>
            )})}
        </div>
        
        {/* Filter Buttons - Accent color for active state */}
        <div className="mb-6 sm:mb-8 flex gap-2 flex-wrap p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <Button
            onClick={() => setFilter("all")}
            className={`rounded-lg font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 ${
              filter === "all"
                ? `text-white hover:bg-[${COLOR_ACCENT}]/90 shadow-md`
                : `bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200`
            }`}
            style={{ backgroundColor: filter === "all" ? COLOR_ACCENT : undefined }}
          >
            All Orders
          </Button>
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`rounded-lg font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 ${
                filter === opt.value
                  ? `text-white hover:bg-[${COLOR_ACCENT}]/90 shadow-md`
                  : `bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200`
              }`}
              style={{ backgroundColor: filter === opt.value ? COLOR_ACCENT : undefined }}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="rounded-xl shadow-md border border-gray-300">
            <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 flex justify-center">
              <div className="text-center">
                <Loader2 className={`w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-3`} style={{ color: COLOR_ACCENT }}/>
                <p className={`text-gray-700 font-medium text-sm sm:text-base`}>Loading your orders...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <Card className="rounded-xl shadow-md border border-gray-300">
            <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center">
              <Package className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3`} style={{ color: COLOR_ACCENT }} />
              <p className={`text-gray-800 font-serif font-medium text-base sm:text-lg mb-1`}>
                No orders found
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                {filter !== "all"
                  ? `No orders with status "${filter}"`
                  : "You haven't received any orders yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-5">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="rounded-xl shadow-lg border-l-4 border-gray-300 hover:shadow-xl transition-shadow duration-300">
              
              {/* Order Header - Accent line, Primary text */}
              <CardHeader className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                  <div>
                    {/* font-serif, Smaller Title, Primary color */}
                    <CardTitle className="text-lg sm:text-xl font-serif font-medium" style={{ color: COLOR_PRIMARY }}>
                      Order #{order.orderNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 font-semibold text-xs border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 sm:pt-5 pb-4 sm:pb-5 px-3 sm:px-4 md:px-6 bg-white grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Customer Info Card */}
                <div className="lg:col-span-1 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-serif font-medium text-sm sm:text-base text-gray-800 mb-2 sm:mb-3 border-b pb-2">
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-500 shrink-0" />
                      <span className="font-medium text-gray-800 wrap-break-word">
                        {order.customer?.Name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-500 shrink-0" />
                      <a
                        href={`mailto:${order.customer?.email}`}
                        className="text-blue-600 hover:underline text-xs sm:text-sm break-all"
                      >
                        {order.customer?.email || "N/A"}
                      </a>
                    </div>
                    {order.shippingAddress?.phone && (
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500 shrink-0" />
                            <span className="text-gray-800 wrap-break-word">{order.shippingAddress.phone}</span>
                        </div>
                    )}
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                            <div className="text-xs text-gray-600 leading-normal wrap-break-word">
                                <p className="font-semibold mb-0.5">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>
                  )}
                </div>

                {/* Order Items Card */}
                <div className="lg:col-span-2 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-serif font-medium text-sm sm:text-base text-gray-800 mb-2 sm:mb-3 border-b pb-2">
                    Items ({order.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col xs:flex-row justify-between xs:items-center gap-2 p-2.5 sm:p-3 bg-white rounded-md border border-gray-200 text-xs sm:text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium truncate">
                            {typeof item.product === "object" ? item.product.title : item.product}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Qty: {item.quantity} @ <span className="font-medium">Rs. {item.price.toFixed(2)}</span>
                          </p>
                        </div>
                        <p className="font-semibold text-sm sm:text-base shrink-0" style={{ color: COLOR_ACCENT }}>
                          Rs. {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status Update & Summary */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2 sm:mt-4">
                    
                    {/* Status Update Section */}
                    <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-gray-800 font-serif font-medium mb-2 text-sm sm:text-base">
                            Update Order Status
                        </label>
                        <div className="flex gap-2 sm:gap-3 items-center">
                            <div className="relative flex-1">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                    disabled={updating === order.id}
                                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-800 font-medium appearance-none bg-white cursor-pointer hover:border-gray-500 focus:border-gray-500 focus:outline-none transition-colors"
                                >
                                    {ORDER_STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 pointer-events-none" />
                            </div>
                            {updating === order.id && (
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                    <span className="font-medium whitespace-nowrap hidden xs:inline">Updating...</span>
                                </div>
                            )}
                        </div>
                    </div>
                
                    {/* Order Summary */}
                    <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-serif font-medium text-sm sm:text-base text-gray-800 mb-2 sm:mb-3 border-b pb-2">
                            Order Summary
                        </h3>
                        <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
                                <span>Subtotal:</span>
                                <span>Rs. {( order.total - 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 border-b pb-1.5 sm:pb-2">
                                <span>Shipping (Fixed):</span>
                                <span>Rs. 100.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5 sm:pt-2">
                                <span className="font-serif font-semibold text-base sm:text-lg" style={{ color: COLOR_PRIMARY }}>Grand Total:</span>
                                <span className="font-serif font-extrabold text-xl sm:text-2xl" style={{ color: COLOR_ACCENT }}>
                                    Rs. {order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  currentPage === page
                    ? `text-white shadow-sm`
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                style={currentPage === page ? { backgroundColor: COLOR_ACCENT } : {}}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}