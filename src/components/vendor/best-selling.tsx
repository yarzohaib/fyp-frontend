// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import type { BestSellingItem } from "@/lib/Types";

// interface BestSellingProps {
//   products: BestSellingItem[];
// }

// export default function BestSelling({ products }: BestSellingProps) {
//   return (
//     <Card>
//       <CardContent className="p-6">
//         <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>

//         {products.length === 0 ? (
//           <p className="text-sm text-muted-foreground">No sales yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {products.map((p) => (
//               <div key={p.productId} className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{p.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {p.totalSold} sold
//                   </p>
//                 </div>
//                 <p className="font-semibold">PKR {p.revenue}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


// best-selling.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { BestSellingItem } from "@/lib/Types";

interface BestSellingProps {
  products: BestSellingItem[];
}

export default function BestSelling({ products }: BestSellingProps) {
  return (
    <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#1A3126' }}>Best Selling Products</h2>

        {products.length === 0 ? (
          <p className="text-sm" style={{ color: '#1A3126', opacity: 0.6 }}>No sales yet.</p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div 
                key={p.productId} 
                className="flex items-center justify-between p-4 rounded-lg" 
                style={{ backgroundColor: '#F2F0E5' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: '#1A3126' }}>{p.name}</p>
                  <p className="text-sm" style={{ color: '#1A3126', opacity: 0.6 }}>
                    {p.totalSold} sold
                  </p>
                </div>
                <p className="font-bold" style={{ color: '#BB4E2C' }}>Rs {p.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}