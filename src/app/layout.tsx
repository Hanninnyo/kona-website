import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kona Island Coffee - Authentic Hawaiian Coffee in the Bay Area",
  description: "Experience the true taste of Hawaiian Kona coffee. From the volcanic slopes of Mauna Loa to your cup. Premium coffee, pastries, and crepes with authentic island flavors.",
  keywords: ["Hawaiian coffee", "Kona coffee", "Bay Area coffee", "premium coffee", "island coffee", "specialty coffee", "coffee shop"],
  authors: [{ name: "Kona Island Coffee" }],
  creator: "Kona Island Coffee",
  publisher: "Kona Island Coffee",
  metadataBase: new URL("https://konaislandcoffee.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://konaislandcoffee.com",
    title: "Kona Island Coffee - Authentic Hawaiian Coffee",
    description: "Experience the true taste of Hawaiian Kona coffee. Premium coffee, pastries, and crepes with authentic island flavors.",
    siteName: "Kona Island Coffee",
    images: [
      {
        url: "/images/og-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Kona Island Coffee - Hawaiian Coffee Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kona Island Coffee - Authentic Hawaiian Coffee",
    description: "Experience the true taste of Hawaiian Kona coffee in the Bay Area.",
    images: ["/images/og-hero.jpg"],
    creator: "@konaislandcoffee",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={leagueSpartan.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://konaislandcoffee.com",
              "name": "Kona Island Coffee",
              "image": "https://konaislandcoffee.com/images/logo.jpg",
              "description": "Authentic Hawaiian Kona coffee experience in the Bay Area",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "CA",
                "addressLocality": "San Francisco",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "37.7749",
                "longitude": "-122.4194"
              },
              "url": "https://konaislandcoffee.com",
              "telephone": "+1-555-KONA-123",
              "priceRange": "$$",
              "openingHours": "Mo-Su 06:00-20:00",
              "servesCuisine": "Coffee",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Free WiFi",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Takeout",
                  "value": true
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-mangabey antialiased" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
