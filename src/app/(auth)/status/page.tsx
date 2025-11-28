"use client";

import { useAuth } from "@/contexts/auth-context";

export default function VendorStatusPage() {
    const { user } = useAuth();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold">Vendor Account Status</h1>
            <p className="mt-4 text-lg">
                Your account status:{" "}
                <span className="font-semibold capitalize">{user.status}</span>
            </p>

            {user.status === "pending" && (
                <p className="mt-4 text-yellow-500">
                    Your account is under review. Please wait for admin approval.
                </p>
            )}

            {user.status === "rejected" && (
                <p className="mt-4 text-red-500">
                    Your account was rejected. Please contact support.
                </p>
            )}

            {user.status === "approved" && (
                <p className="mt-4 text-green-600">
                    Your account is approved! You can now access your dashboard.
                </p>
            )}
        </div>
    );
}
