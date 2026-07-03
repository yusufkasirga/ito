import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ito-rust.vercel.app"),
  title: "Itinerary of Türkiye — Tourism, Medical, Investment & Business Advisory",
  description: "Your trusted local partner in Türkiye. Medical travel coordination and private Türkiye experiences — with investment and business advisory available on request. Serving clients from UK, UAE, Europe and beyond.",
  keywords: "Turkey tourism, medical tourism Turkey, hair transplant Turkey, dental Turkey, real estate Istanbul, investment Turkey, business Turkey",
  openGraph: {
    title: "Itinerary of Türkiye",
    description: "Your trusted local partner for medical travel and private Türkiye experiences.",
    url: "https://ito-rust.vercel.app",
    siteName: "Itinerary of Türkiye",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Itinerary of Türkiye — Medical Travel & Private Türkiye Experiences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itinerary of Türkiye",
    description: "Your trusted local partner in Türkiye.",
    images: ["/og-image.png"],
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
              "description": "Medical travel coordination and private Türkiye experiences, with investment and business advisory available on request.",
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
