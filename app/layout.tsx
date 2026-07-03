import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ito-rust.vercel.app"),
  title: "Itinerary of Türkiye — Tourism, Medical, Investment & Business Advisory",
  description: "Your trusted local partner in Türkiye. Premium advisory for tourism, medical tourism, real estate investment and business. Serving clients from UK, UAE, Europe and beyond.",
  keywords: "Turkey tourism, medical tourism Turkey, hair transplant Turkey, dental Turkey, real estate Istanbul, investment Turkey, business Turkey",
  openGraph: {
    title: "Itinerary of Türkiye",
    description: "Your trusted local partner for tourism, medical procedures, investment and business in Türkiye.",
    url: "https://ito-rust.vercel.app",
    siteName: "Itinerary of Türkiye",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Itinerary of Türkiye",
    description: "Your trusted local partner in Türkiye.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Itinerary of Türkiye",
              "description": "Premium advisory for tourism, medical tourism, real estate and business in Türkiye.",
              "url": "https://ito-rust.vercel.app",
              "telephone": process.env.NEXT_PUBLIC_WHATSAPP_E164_NUMBER ?? "",
              "address": { "@type": "PostalAddress", "addressCountry": "TR" },
              "sameAs": []
            })
          }}
        />
      </head>
      <body style={{margin:0, padding:0}}>{children}</body>
    </html>
  );
}
