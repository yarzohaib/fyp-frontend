"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { BestSellingItem } from "@/lib/Types";

interface BestSellingProps {
  products: BestSellingItem[];
}

export default function BestSelling({ products }: BestSellingProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>

        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sales yet.</p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.productId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.totalSold} sold
                  </p>
                </div>
                <p className="font-semibold">PKR {p.revenue}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
