
// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import type { MonthlyRevenuePoint } from "@/lib/Types";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// type Props = { data: MonthlyRevenuePoint[] };

// export default function RevenueChart({ data }: Props) {
//     return (
//         <Card>
//             <CardContent className="p-6">
//                 <h2 className="text-xl font-semibold mb-4">Revenue</h2>

//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={data}>
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line
//                             type="monotone"
//                             dataKey="revenue"
//                             stroke="currentColor"
//                             strokeWidth={3}
//                         />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </CardContent>
//         </Card>
//     );
// }





// revenue-chart.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { MonthlyRevenuePoint } from "@/lib/Types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type Props = { data: MonthlyRevenuePoint[] };

export default function RevenueChart({ data }: Props) {
    return (
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#1A3126' }}>Revenue Overview</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#1A3126"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            stroke="#1A3126"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1A3126', 
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#BB4E2C"
                            strokeWidth={3}
                            dot={{ fill: '#BB4E2C', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}