import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "Privacy Policy – DOMA",
    description: "Learn how DOMA collects, uses, and protects your personal data.",
};

const sections = [
    {
        number: "1",
        title: "Information We Collect",
        content:
            "To provide you with the DOMA experience, we collect specific information when you use our platform. This includes account registration details (name, email, address), payment information (processed securely via third-party providers), and images or room dimensions you upload to use our AI Room Redesign and AR features.",
    },
    {
        number: "2",
        title: "How We Use Your Data",
        content:
            "Your data is used strictly to facilitate transactions between you and our vendors, improve your user experience, and power our recommendation engines. Images uploaded to the AI Room Redesign tool are processed to generate your visualizations and are not used publicly without your explicit consent.",
    },
    {
        number: "3",
        title: "Sharing with Vendors",
        content:
            "Because DOMA is a two-sided marketplace, we share your shipping address and contact information with the specific vendor(s) you purchase from solely for the purpose of fulfilling and delivering your order. Vendors are prohibited from using this data for outside marketing without your permission.",
    },
    {
        number: "4",
        title: "Data Security",
        content:
            "We implement industry-standard security measures to protect your personal information. We do not sell your personal data to third-party data brokers.",
    },
];

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F2F0E5] pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C] mb-4">
                            Legal
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A3126] leading-tight">
                            Privacy Policy
                        </h1>
                        <div className="mt-6 w-12 h-0.5 bg-[#BB4E2C]" />
                        <p className="mt-5 text-sm text-[#6C757D]">Last Updated: May 2026</p>
                    </div>

                    {/* Intro */}
                    <div className="mb-10 p-5 bg-white rounded-xl border border-[#1A3126]/10 text-sm text-[#212529] leading-relaxed">
                        Your privacy matters to us. This policy explains exactly what information DOMA collects, why we collect it,
                        and how we keep it secure. By using the DOMA platform, you agree to the practices described here.
                    </div>

                    {/* Sections */}
                    <div className="space-y-10">
                        {sections.map((section) => (
                            <section key={section.number}>
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-xs font-bold text-[#BB4E2C] tracking-widest">
                                        {section.number.padStart(2, "0")}
                                    </span>
                                    <h2 className="text-lg font-bold text-[#1A3126]">{section.title}</h2>
                                </div>
                                <p className="text-[#212529] leading-relaxed text-[0.9375rem]">
                                    {section.content}
                                </p>
                                <div className="mt-10 border-t border-[#1A3126]/8" />
                            </section>
                        ))}
                    </div>

                    <p className="mt-12 text-xs text-[#6C757D] text-center">
                        &copy; 2026 DOMA. All rights reserved. For privacy-related questions, contact{" "}
                        <a href="mailto:support@thedoma.shop" className="text-[#BB4E2C] hover:underline">
                            support@thedoma.shop
                        </a>
                        .
                    </p>
                </div>
            </main>
        </>
    );
}
