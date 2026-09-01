import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import WhatsAppTracker from "./components/WhatsAppTracker";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://itineraryofturkiye.com"),
  alternates: { canonical: "https://itineraryofturkiye.com/", languages: { en: "https://itineraryofturkiye.com/", de: "https://itineraryofturkiye.com/de", ru: "https://itineraryofturkiye.com/ru", "x-default": "https://itineraryofturkiye.com/" } },
  verification: { google: "TnMT4ipicMyjRooHW9Oub_W1Dp7BxLIz5tn_5Bqk_-A" },
  title: "Itinerary of Türkiye — Medical Travel & Private Türkiye Experiences Advisory",
  description: "Independent advisory for medical travel and private Türkiye experiences. We plan the journey, verify every provider and stay with you — paid by our clients, never by commissions. Serving clients from UK, UAE, Europe and beyond.",
  openGraph: {
    title: "Itinerary of Türkiye",
    description: "Your trusted local partner for medical travel and private Türkiye experiences.",
    url: "https://itineraryofturkiye.com",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "@id": "https://itineraryofturkiye.com/#organization",
              "name": "Itinerary of Türkiye",
              "alternateName": "ITO",
              "description": "Medical travel coordination and private Türkiye experiences, with investment and business advisory available on request.",
              "url": "https://itineraryofturkiye.com",
              "logo": "https://itineraryofturkiye.com/logo.png",
              "image": "https://itineraryofturkiye.com/og-image.png",
              "telephone": process.env.NEXT_PUBLIC_WHATSAPP_E164_NUMBER ?? "",
              "email": "itineraryofturkiye@gmail.com",
              "address": { "@type": "PostalAddress", "addressCountry": "TR" },
              "areaServed": [
                { "@type": "Country", "name": "Türkiye" },
                { "@type": "Country", "name": "United Kingdom" },
                { "@type": "Country", "name": "Germany" },
                { "@type": "Country", "name": "United Arab Emirates" },
                { "@type": "Country", "name": "Russia" }
              ],
              "knowsLanguage": ["en", "tr", "de", "ru"],
              "priceRange": "Free initial consultation",
              "makesOffer": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Medical travel coordination", "serviceType": "Hair restoration, dental care and aesthetic surgery coordination with verified partner clinics" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Türkiye experiences", "serviceType": "Tailor-made itineraries, guides and travel coordination" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business and investment advisory", "serviceType": "Real estate and business travel advisory, available on request" } }
              ],
              "sameAs": ["https://www.instagram.com/itineraryofturkiye"]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://itineraryofturkiye.com/#website",
              "url": "https://itineraryofturkiye.com",
              "name": "Itinerary of Türkiye",
              "description": "Independent advisory for medical travel and private Türkiye experiences.",
              "inLanguage": ["en", "de", "ru"],
              "publisher": { "@id": "https://itineraryofturkiye.com/#organization" }
            })
          }}
        />
      </head>
      <body style={{margin:0, padding:0}}>{children}<Analytics /><WhatsAppTracker /></body>
    </html>
  );
}
