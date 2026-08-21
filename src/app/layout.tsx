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
        {/*
          A neutral wrapper, not a landmark. Legacy routes such as /locations
          render their own <main>, and a global <main> here would nest them.
          Each route is responsible for its own <main>; the homepage provides
          one. Some legacy routes still have none — that is tracked for the
          later route audit rather than fixed here.
          tabIndex={-1} makes this a valid skip-link target.
        */}
        <div id="content" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  )
}
