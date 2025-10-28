import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Kona Island Coffee — Hawaiian Coffee in the Bay Area",
  description: "Premium Kona coffee, crêpes, and pastries. Visit us in San Jose and Mountain View (coming soon).",
  metadataBase: new URL("https://konaislandcoffee.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://konaislandcoffee.com",
    title: "Kona Island Coffee — Hawaiian Coffee in the Bay Area",
    description: "Premium Kona coffee, crêpes, and pastries. Visit us in San Jose and Mountain View (coming soon).",
    siteName: "Kona Island Coffee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
