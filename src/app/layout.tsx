import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Kona Island Coffee — Hawaiian Coffee in the Bay Area",
  description:
    "Premium Kona coffee, crêpes, and pastries. Visit us in San Jose and Mountain View (coming soon).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-kona-white text-kona-espresso">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
