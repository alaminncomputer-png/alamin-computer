import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppButton";
import AIRecommend from "@/components/AIRecommend";

export const metadata: Metadata = {
  title: {
    default: "Alamin Computer — Trusted Laptop Store | Wholesale & Retail | Addis Ababa Ethiopia",
    template: "%s | Alamin Computer",
  },
  description:
    "Alamin Computer — Ethiopia's #1 trusted laptop store. HP EliteBook, Dell Latitude, Lenovo ThinkPad, Gaming & Used laptops. Wholesale & retail prices in Addis Ababa.",
  keywords: [
    "laptop store Ethiopia",
    "HP EliteBook price",
    "wholesale laptops",
    "used laptops Addis Ababa",
    "Core i7 laptops",
    "affordable laptops Ethiopia",
    "Alamin Computer",
    "refurbished laptops Ethiopia",
  ],
  openGraph: {
    title: "Alamin Computer — Trusted Laptop Store Ethiopia",
    description: "Wholesale & retail laptops in Addis Ababa, Ethiopia",
    type: "website",
    locale: "en_US",
    siteName: "Alamin Computer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text font-body antialiased">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
          <Footer />
      <WhatsAppFloat />
          <AIRecommend />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0b1527",
              color: "#e8f0ff",
              border: "1px solid rgba(26,107,255,0.3)",
              fontFamily: "'DM Sans', sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
// trigger
