// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kona Island Coffee — Hawaiian Coffee in the Bay Area",
  description:
    "Premium Kona coffee, crêpes, and pastries. Visit us in San Jose and Mountain View (coming soon).",
  openGraph: {
    title: "Kona Island Coffee",
    description:
      "Premium Hawaiian coffee in the Bay Area. Catering available.",
    url: "https://YOUR-DOMAIN",
    siteName: "Kona Island Coffee",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
