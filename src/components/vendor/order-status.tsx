// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import type { OrderStatusStats } from "@/lib/Types";

// interface OrderStatusProps {
//   stats: OrderStatusStats | null;
// }

// export default function OrderStatus({ stats }: OrderStatusProps) {
//   if (!stats) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <p className="text-muted-foreground">No data available</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   const total = stats.pending + stats.delivered + stats.cancelled || 1;

//   const formatted = [
//     { label: "Pending", value: (stats.pending / total) * 100 },
//     { label: "Delivered", value: (stats.delivered / total) * 100 },
//     { label: "Cancelled", value: (stats.cancelled / total) * 100 },
//   ];

//   return (
//     <Card>
//       <CardContent className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Order Status</h2>

//         {formatted.map((item) => (
//           <div key={item.label}>
//             <div className="flex justify-between text-sm mb-1">
//               <span>{item.label}</span>
//               <span>{item.value.toFixed(0)}%</span>
//             </div>
//             <Progress value={item.value} />
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }



// order-status.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { OrderStatusStats } from "@/lib/Types";

interface OrderStatusProps {
  stats: OrderStatusStats | null;
}

export default function OrderStatus({ stats }: OrderStatusProps) {
  if (!stats) {
    return (
      <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
        <CardContent className="p-6">
          <p style={{ color: '#1A3126', opacity: 0.6 }}>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const total = stats.pending + stats.delivered + stats.cancelled || 1;

  const formatted = [
    { 
      label: "Pending", 
      value: (stats.pending / total) * 100,
      count: stats.pending,
      color: '#BB4E2C'
    },
    { 
      label: "Delivered", 
      value: (stats.delivered / total) * 100,
      count: stats.delivered,
      color: '#1A3126'
    },
    { 
      label: "Cancelled", 
      value: (stats.cancelled / total) * 100,
      count: stats.cancelled,
      color: '#6B7280'
    },
  ];

  return (
    <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold" style={{ color: '#1A3126' }}>Order Status</h2>

        {formatted.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium" style={{ color: '#1A3126' }}>{item.label}</span>
              <span className="font-semibold" style={{ color: '#1A3126' }}>
                {item.count} ({item.value.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: '#F2F0E5' }}>
              <div 
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${item.value}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
