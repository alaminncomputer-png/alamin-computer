import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Alamin Computer — Trusted Laptop Store | Wholesale & Retail | Addis Ababa Ethiopia',
    template: '%s | Alamin Computer',
  },
  description:
    "Alamin Computer — Ethiopia's #1 trusted laptop store. HP EliteBook, Dell Latitude, Lenovo ThinkPad, Gaming & Business laptops. Wholesale & retail prices in Addis Ababa.",
  keywords: [
    'laptop store Ethiopia',
    'HP EliteBook price Ethiopia',
    'used laptops Addis Ababa',
    'wholesale laptops Ethiopia',
    'Core i7 laptops Ethiopia',
    'affordable laptops Addis Ababa',
    'Alamin Computer',
    'Dell Latitude Ethiopia',
    'Lenovo ThinkPad Addis Ababa',
    'gaming laptops Ethiopia',
  ],
  openGraph: {
    siteName: 'Alamin Computer',
    type: 'website',
    locale: 'en_ET',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0b1527',
              color: '#e8f0ff',
              border: '1px solid rgba(26,107,255,0.3)',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00c77a', secondary: '#0b1527' },
            },
            error: {
              iconTheme: { primary: '#ff3b3b', secondary: '#0b1527' },
            },
          }}
        />
      </body>
    </html>
  );
}
