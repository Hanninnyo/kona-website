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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* …page content… */}
    </>
  );
}
