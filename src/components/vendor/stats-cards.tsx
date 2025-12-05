
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/lib/Types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Monthly Revenue",
      value: `Rs ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Yearly Revenue",
      value: `Rs ${stats.yearlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <h2 className="text-2xl font-bold">{c.value}</h2>
            </div>
            <c.icon size={32} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
