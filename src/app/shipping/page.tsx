import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { Package, MapPin, AlertCircle, Truck } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping & Delivery – DOMA",
    description: "Learn how shipping and fulfillment works on the DOMA marketplace.",
};

export default function ShippingPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F2F0E5] pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C] mb-4">
                            Support
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A3126] leading-tight">
                            Shipping &amp; Delivery<br />Information
                        </h1>
                        <div className="mt-6 w-12 h-0.5 bg-[#BB4E2C]" />
                        <p className="mt-5 text-[#212529] leading-relaxed">
                            How Fulfillment Works on DOMA
                        </p>
                    </div>

                    {/* The DOMA Marketplace Model */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-[#1A3126] mb-4">The DOMA Marketplace Model</h2>
                        <p className="text-[#212529] leading-relaxed">
                            DOMA is a digital platform designed to connect passionate buyers with skilled, independent furniture
                            makers and vendors. We provide the technology, but the physical fulfillment of your order is handled
                            directly by the creators.
                        </p>
                    </section>

                    <div className="border-t border-[#1A3126]/10 mb-10" />

                    {/* Vendor Shipping Policies */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-[#1A3126] mb-4">Vendor Shipping Policies</h2>
                        <p className="text-[#212529] leading-relaxed mb-6">
                            Because our items range from small decor pieces to large custom sofas, shipping is managed independently
                            by the respective store or vendor you purchase from.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-white rounded-xl border border-[#1A3126]/10">
                                <Truck className="w-5 h-5 text-[#BB4E2C] shrink-0 mt-0.5" />
                                <p className="text-[#212529] text-sm leading-relaxed">
                                    Shipping costs, delivery timelines, and available couriers are determined by the individual vendor
                                    and will be displayed during the checkout process.
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 bg-white rounded-xl border border-[#1A3126]/10">
                                <Package className="w-5 h-5 text-[#BB4E2C] shrink-0 mt-0.5" />
                                <p className="text-[#212529] text-sm leading-relaxed">
                                    Once an order is placed, the vendor is solely responsible for safely packaging, dispatching, and
                                    delivering the item to your specified address.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-[#1A3126]/10 mb-10" />

                    {/* Tracking */}
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-[#1A3126]" />
                            <h2 className="text-xl font-bold text-[#1A3126]">Tracking Your Order</h2>
                        </div>
                        <p className="text-[#212529] leading-relaxed">
                            When a vendor ships your item, they will update your order status with the relevant tracking information.
                            You can monitor the progress of your delivery directly through your DOMA Profile dashboard.
                        </p>
                    </section>

                    <div className="border-t border-[#1A3126]/10 mb-10" />

                    {/* Delivery Issues */}
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-[#1A3126]" />
                            <h2 className="text-xl font-bold text-[#1A3126]">Resolving Delivery Issues</h2>
                        </div>
                        <p className="text-[#212529] leading-relaxed">
                            If an item arrives damaged or is delayed, your first point of contact should be the vendor. However,
                            DOMA provides dispute resolution support to ensure you are protected. If a vendor fails to fulfill an
                            order, please contact our support team immediately.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="mt-6 p-6 bg-[#1A3126] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-[#F2F0E5] font-semibold">Need help with an order?</p>
                            <p className="text-[#F2F0E5]/60 text-sm mt-1">Our support team is ready to assist you.</p>
                        </div>
                        <a
                            href="/contact"
                            className="shrink-0 bg-[#BB4E2C] text-white px-6 py-3 rounded-lg font-semibold text-sm
                                       hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
