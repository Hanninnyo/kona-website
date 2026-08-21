import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/content/site'

/**
 * Global site footer. Server-rendered; no interactivity.
 *
 * Deliberately minimal, and deliberately incomplete where facts are unverified:
 * hours and social profiles are omitted rather than guessed, and both ordering
 * destinations are shown separately because the café and the truck are distinct
 * locations with distinct menus.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line-inverse bg-surface-inverse text-ink-inverse">
      <div className="mx-auto max-w-page px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${site.brand.name} — home`}>
              <Image
                src={site.brand.logoMark.src}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="font-display text-xl leading-tight">
                Kona Island Coffee
              </span>
            </Link>
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-ink-inverse-soft">
              {site.brand.positioning}, served in Mountain View and from our
              Bay Area coffee truck.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-inverse-soft">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-ink-inverse transition-colors duration-200 hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-inverse-soft">
              Order
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {site.locations.map((location) => (
                <li key={location.id}>
                  <a
                    href={location.ordering.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-ink-inverse transition-colors duration-200 hover:text-gold-400"
                  >
                    {location.ordering.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.giftCardsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-ink-inverse transition-colors duration-200 hover:text-gold-400"
                >
                  Gift Cards
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line-inverse pt-10 sm:grid-cols-2">
          {site.locations.map((location) => (
            <div key={location.id}>
              <h2 className="font-display text-lg">{location.name}</h2>
              <address className="mt-2 font-body text-sm not-italic leading-relaxed text-ink-inverse-soft">
                {location.address.street}
                {location.address.unit ? `, ${location.address.unit}` : ''}
                <br />
                {location.address.city}, {location.address.region}{' '}
                {location.address.postalCode}
              </address>
              <a
                href={location.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-body text-sm text-gold-400 underline-offset-4 hover:underline"
              >
                Directions
                <span className="sr-only">
                  {' '}
                  to {location.name} (opens in a new tab)
                </span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-inverse pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-ink-inverse-soft">
            © {year} {site.brand.name}. All rights reserved.
          </p>
          {/*
            Hours, phone, email and social profiles are intentionally absent
            until the owner confirms both the values and how they should be
            managed. Nothing stands in for them. See src/content/site.ts.
          */}
        </div>
      </div>
    </footer>
  )
}
