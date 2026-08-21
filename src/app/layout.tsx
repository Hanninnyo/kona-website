import type { Metadata } from 'next'
import { Cormorant_Garamond, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { site } from '@/content/site'

/**
 * Self-hosted via next/font: no external request at runtime, and metrics are
 * pre-computed so swapping from the fallback causes no layout shift.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const body = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kona Island Coffee — 100% Kona Coffee in Mountain View',
    template: '%s — Kona Island Coffee',
  },
  description:
    'A Mountain View café serving 100% authentic Kona coffee, handcrafted drinks, chimney cakes and bakery items, plus a Bay Area coffee truck.',
  applicationName: site.brand.name,
  openGraph: {
    title: 'Kona Island Coffee — 100% Kona Coffee in Mountain View',
    description:
      'A Mountain View café serving 100% authentic Kona coffee, handcrafted drinks, chimney cakes and bakery items, plus a Bay Area coffee truck.',
    siteName: site.brand.name,
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
