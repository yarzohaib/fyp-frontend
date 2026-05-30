import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "Terms of Service – DOMA",
    description: "Read DOMA's Terms of Service covering the marketplace, AI tools, payments, and intellectual property.",
};

const sections = [
    {
        number: "1",
        title: "Acceptance of Terms",
        content: (
            <p>
                By accessing or using the DOMA website (the &ldquo;Platform&rdquo;), including our mobile applications and AI/AR
                features, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
        ),
    },
    {
        number: "2",
        title: "The DOMA Marketplace Ecosystem",
        content: (
            <>
                <p className="mb-4">
                    DOMA operates as a two-sided marketplace connecting independent vendors/merchants with buyers.
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0" />
                        <span>
                            <strong className="text-[#1A3126]">User Accounts:</strong> You are responsible for safeguarding your
                            account login credentials.
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0" />
                        <span>
                            <strong className="text-[#1A3126]">Vendor Responsibilities:</strong> Vendors are exclusively responsible
                            for the accuracy of their product listings, fulfillment of orders, and ensuring all physical items match
                            the descriptions provided on the Platform. DOMA facilitates the transaction but is not the manufacturer
                            of the items sold by third-party vendors.
                        </span>
                    </li>
                </ul>
            </>
        ),
    },
    {
        number: "3",
        title: "AI Room Redesign & AR Visualization Tools",
        content: (
            <>
                <p className="mb-4">
                    DOMA provides advanced AI image generation and Augmented Reality (AR) tools to assist users in visualizing
                    furniture.
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0" />
                        <span>
                            <strong className="text-[#1A3126]">Accuracy:</strong> While our AR module and AI styling tools strive for
                            high accuracy, they are meant for visualization purposes. Actual physical dimensions, colors, and textures
                            of the physical products may vary slightly due to screen calibration and real-world lighting.
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BB4E2C] shrink-0" />
                        <span>
                            <strong className="text-[#1A3126]">Acceptable Use of AI:</strong> The AI Room Redesign feature must only
                            be used for personal interior design visualization. Users may not upload explicit, copyrighted, or
                            sensitive images into the AI generator.
                        </span>
                    </li>
                </ul>
            </>
        ),
    },
    {
        number: "4",
        title: "Purchasing and Payments",
        content: (
            <p>
                All prices are listed in Pakistani Rupees (PKR) unless otherwise noted. By submitting an order, you authorize DOMA
                and our third-party payment processors to charge your selected payment method. We reserve the right to cancel any
                order due to pricing errors, stock unavailability, or suspected fraudulent activity.
            </p>
        ),
    },
    {
        number: "5",
        title: "Intellectual Property",
        content: (
            <p>
                The DOMA name, logo, proprietary algorithms, website design, and AI models are the exclusive property of DOMA.
                Vendors retain the rights to their individual product images and descriptions but grant DOMA a license to display,
                modify (including background removal/inpainting for our virtual studio), and promote these assets across the Platform.
            </p>
        ),
    },
    {
        number: "6",
        title: "Limitation of Liability",
        content: (
            <p>
                To the maximum extent permitted by law, DOMA shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of the Platform, the failure of a vendor to deliver a product, or any discrepancies
                between the AR/AI visualizations and the physical items.
            </p>
        ),
    },
    {
        number: "7",
        title: "Contact Information",
        content: (
            <p>
                For any questions regarding these Terms or support with your account, please contact our support team at{" "}
                <a href="mailto:support@doma.pk" className="text-[#BB4E2C] hover:underline font-medium">
                    support@doma.pk
                </a>
                .
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#BB4E2C] mb-4">
                            Legal
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A3126] leading-tight">
                            Terms of Service
                        </h1>
                        <div className="mt-6 w-12 h-0.5 bg-[#BB4E2C]" />
                        <p className="mt-5 text-sm text-[#6C757D]">Last Updated: May 2026</p>
                    </div>

                    {/* Intro note */}
                    <div className="mb-10 p-5 bg-white rounded-xl border border-[#1A3126]/10 text-sm text-[#212529] leading-relaxed">
                        Please read these Terms of Service carefully before using the DOMA platform. These terms govern your access
                        to and use of all DOMA services, including our website, mobile applications, and AI/AR features.
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
                                <div className="text-[#212529] leading-relaxed text-[0.9375rem]">
                                    {section.content}
                                </div>
                                <div className="mt-10 border-t border-[#1A3126]/8" />
                            </section>
                        ))}
                    </div>

                    {/* Footer note */}
                    <p className="mt-12 text-xs text-[#6C757D] text-center">
                        &copy; 2026 DOMA. All rights reserved. These terms are subject to change without notice.
                    </p>
                </div>
            </main>
        </>
    );
}
