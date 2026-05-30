import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";
import { CartProvider } from '@/contexts/cart-context'
import { ToastProvider } from '@/components/ui/toast'
import { DomaSenseButton } from '@/components/doma-sense-button'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DOMA",
    template: "%s | DOMA",
  },
  description: "Discover our exclusive collection of premium furniture and home decor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <Footer />
              <DomaSenseButton />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
