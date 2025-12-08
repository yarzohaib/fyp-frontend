"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/lib/Types";

// --- CUSTOM COLOR MAPPING ---
const COLOR_ACCENT = "#BB4E2C"; // Muted Terracotta

// Defining distinct, complementing color themes for the four cards.
const CARD_THEMES = [
  // Total Products: Deep Green (Primary)
  { 
    bg: "#b5456a", 
    text: "white", 
    iconColor: "white" 
  },
  // Total Orders: Muted Gold/Amber
  { 
    bg: "#835499", // Muted Gold/Tan 
    text: "white", 
    iconColor: "white" 
  },
  // Monthly Revenue: Muted Blue/Teal
  { 
    bg: "#468270", // A softer, dark teal
    text: "white", 
    iconColor: "white" 
  },
  // Yearly Revenue: Muted Terracotta (Accent)
  { 
    bg: COLOR_ACCENT, 
    text: "white", 
    iconColor: "white" 
  },
];

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
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
      {cards.map((c, index) => {
        const theme = CARD_THEMES[index];
        return (
          // Apply custom background color and simplified border/shadow
          <Card 
            key={c.title} 
            className="border-0 shadow-lg rounded-xl transition-transform duration-300 hover:scale-[1.02]" 
            style={{ backgroundColor: theme.bg }}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                {/* Text color set to theme.text, slightly muted */}
                <p 
                  className="text-sm mb-2 font-medium" 
                  style={{ color: theme.text, opacity: 0.8 }}
                >
                  {c.title}
                </p>
                {/* Value color set to theme.text for high contrast */}
                <h2 
                  className="text-2xl font-serif font-bold" 
                  style={{ color: theme.text }}
                >
                  {c.value}
                </h2>
              </div>
              {/* Icon color set to theme.iconColor */}
              <c.icon size={32} style={{ color: theme.iconColor }} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}