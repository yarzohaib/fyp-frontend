import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us – DOMA",
    description: "Get in touch with the DOMA team for buyer support, vendor inquiries, or general questions.",
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C] mb-4">
                            Support
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A3126] leading-tight">
                            Contact DOMA
                        </h1>
                        <div className="mt-6 w-12 h-0.5 bg-[#BB4E2C]" />
                        <p className="mt-5 text-[#212529] text-lg leading-relaxed">
                            We are here to help.
                        </p>
                    </div>

                    {/* Intro */}
                    <p className="text-[#212529] leading-relaxed mb-10">
                        Whether you are a buyer needing help with an order, or a vendor looking to optimize your virtual studio,
                        the DOMA team is ready to assist you.
                    </p>

                    {/* Contact cards */}
                    <div className="space-y-5">

                        {/* Customer Support */}
                        <div className="bg-white rounded-2xl border border-[#1A3126]/10 p-7">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-[#1A3126]" />
                                </div>
                                <h2 className="text-lg font-bold text-[#1A3126]">Customer Support</h2>
                            </div>
                            <p className="text-[#212529] text-sm leading-relaxed mb-4">
                                For questions regarding your account, technical issues with the AI/AR tools, or general inquiries,
                                please reach out to us at:
                            </p>
                            <a
                                href="mailto:support@thedoma.shop"
                                className="inline-flex items-center gap-2 text-[#BB4E2C] font-semibold text-sm hover:underline"
                            >
                                <Mail className="w-4 h-4" />
                                support@thedoma.shop
                            </a>
                        </div>

                        {/* Office */}
                        <div className="bg-[#1A3126] rounded-2xl p-7">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Office Location</h2>
                            </div>
                            <p className="text-white font-semibold mb-1">DOMA Headquarters</p>
                            <p className="text-white/70 text-sm mb-4">Lahore, Pakistan</p>
                            <p className="text-white/60 text-xs leading-relaxed">
                                As a digital-first marketplace, we do not host a public showroom at our corporate office. All
                                shopping and AR visualization is done directly through the DOMA app and website.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
