
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
} from "recharts";

type Props = { data: MonthlyRevenuePoint[] };

export default function RevenueChart({ data }: Props) {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Revenue</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="currentColor"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}