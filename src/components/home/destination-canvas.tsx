'use client'

import { useState } from 'react'
import Image from 'next/image'
import { homepage } from '@/content/homepage'
import { site } from '@/content/site'

/**
 * Two Ways to Find Your Island Escape — the full-canvas café/truck toggle.
 *
 * Replaces the previous two-card grid (`visit-destinations.tsx`, still on
 * disk and untouched, just no longer mounted) with the full-bleed
 * choice-and-reveal presentation: selecting one destination swaps the whole
 * background photograph and reveals that destination's hours, directions and
 * ordering action. Every fact still reads from `site.locations` via
 * `homepage.visit`, so nothing here can drift from the rest of the site.
 *
 * Sweet crêpes are a truck-only fact enforced at the content layer
 * (`food.ts`, `/pastries`) and are not referenced here at all.
 */
export function DestinationCanvas() {
  const { visit } = homepage
  const [activeId, setActiveId] = useState(visit.destinations[0].id)
  const active = visit.destinations.find((d) => d.id === activeId)!
  const hours = site.locations.find((l) => l.id === active.id)!.hours

  return (
    <section
      aria-labelledby="destinations-heading"
      className="relative flex min-h-[80svh] items-end overflow-hidden bg-charcoal-900"
    >
      <div className="absolute inset-0">
        {visit.destinations.map((destination) => (
          <div
            key={destination.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-calm ${
              destination.id === activeId ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={destination.id !== activeId}
          >
            {destination.image.src && (
              <Image
                src={destination.image.src}
                alt={destination.image.alt}
                fill
                priority={destination.id === visit.destinations[0].id}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-charcoal-900/10"
        />
      </div>

      <div className="relative mx-auto w-full max-w-page px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          {visit.eyebrow}
        </p>
        <h2
          id="destinations-heading"
          className="mt-5 max-w-xl font-display text-display-md font-light text-sand-50"
        >
          Two Ways to Find Your Island Escape
        </h2>

        <div role="tablist" aria-label="Choose a destination" className="mt-9 flex flex-wrap gap-3">
          {visit.destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              role="tab"
              aria-selected={destination.id === activeId}
              onClick={() => setActiveId(destination.id)}
              className={`rounded-panel border px-6 py-3 font-body text-sm tracking-wide transition-colors duration-200 ${
                destination.id === activeId
                  ? 'border-sand-50 bg-sand-50 text-charcoal-900'
                  : 'border-sand-50/45 text-sand-50 hover:border-sand-50 hover:bg-sand-50/10'
              }`}
            >
              {destination.label}
            </button>
          ))}
        </div>

        <div key={active.id} className="discovery-enter mt-9 max-w-lg">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/70">
            {active.place}
          </p>

          {hours.state === 'verified' && hours.value.length > 0 && (
            <dl className="mt-4 font-body text-base leading-relaxed text-sand-100/90">
              {hours.value.map((line) => (
                <dd key={line}>{line}</dd>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={active.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
            >
              {active.primary.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={active.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/45 px-7 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
            >
              {active.secondary.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
