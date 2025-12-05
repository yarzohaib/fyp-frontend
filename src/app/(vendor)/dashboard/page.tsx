"use client";

import { useEffect, useState } from "react";
import StatsCards from "@/components/vendor/stats-cards";
import BestSelling from "@/components/vendor/best-selling";
import OrderStatus from "@/components/vendor/order-status";
import RevenueChart from "@/components/vendor/revenue-chart";
import {
  getDashboardStats,
  getMonthlyRevenueChart,
  getOrderStatus,
  getBestSelling,
} from "@/lib/payload";
import type {
  DashboardStats,
  MonthlyRevenuePoint,
  OrderStatusStats,
  BestSellingItem,
} from "@/lib/Types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<MonthlyRevenuePoint[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatusStats | null>(null);
  const [bestSelling, setBestSelling] = useState<BestSellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken") || localStorage.getItem("token")
            : null;

        if (!token) {
          setError("Please login to view dashboard");
          setLoading(false);
          return;
        }

        // Fetch all data in parallel
        const [statsData, revenueChartData, orderStatusData, bestSellingData] =
          await Promise.all([
            getDashboardStats(),
            getMonthlyRevenueChart(),
            getOrderStatus(),
            getBestSelling(),
          ]);

        setStats(statsData);
        setRevenueData(revenueChartData);
        setOrderStats(orderStatusData);
        setBestSelling(bestSellingData);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BB4E2C] mx-auto mb-4"></div>
          <p className="text-[#1A3126]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#BB4E2C] text-white rounded-lg hover:bg-[#A03D1F]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#1A3126]">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <OrderStatus stats={orderStats} />
      </div>

      <BestSelling products={bestSelling} />
    </div>
  );
}
