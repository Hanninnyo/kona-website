import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Kona Island Coffee — Hawaiian Coffee in the Bay Area",
  description:
    "Premium Kona coffee, crêpes, and pastries. Now open in Mountain View and serving San Jose.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}

        {/* GLOBAL COPYRIGHT FOOTER */}
        <footer className="py-6 text-center text-kona-espresso/60 text-sm">
          © {new Date().getFullYear()} Kona Island Coffee — All Rights Reserved.
        </footer>
      </body>
    </html>
  );
}
