"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { OrderStatusStats } from "@/lib/Types";

interface OrderStatusProps {
  stats: OrderStatusStats | null;
}

export default function OrderStatus({ stats }: OrderStatusProps) {
  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = stats.pending + stats.delivered + stats.cancelled || 1;

  const formatted = [
    { label: "Pending", value: (stats.pending / total) * 100 },
    { label: "Delivered", value: (stats.delivered / total) * 100 },
    { label: "Cancelled", value: (stats.cancelled / total) * 100 },
  ];

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order Status</h2>

        {formatted.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span>{item.value.toFixed(0)}%</span>
            </div>
            <Progress value={item.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
