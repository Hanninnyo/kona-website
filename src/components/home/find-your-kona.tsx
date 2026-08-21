import Link from 'next/link'
import { CoffeeDiscovery } from '@/components/home/coffee-discovery'
import { SectionReveal } from '@/components/section-reveal'
import { discovery } from '@/content/discovery'

/**
 * Find Your Kona — the section shell.
 *
 * A Server Component: the eyebrow, heading and the whole bean collection are
 * in the initial HTML, so the section is readable and indexable before any
 * JavaScript runs.
 *
 * Without JavaScript the guided interaction cannot work, so rather than
 * leaving an inert Begin button, the `<noscript>` block hides the interactive
 * panel and presents the collection itself — five coffees with their real
 * classification, roast and flavour. That is a useful destination in its own
 * right, not an apology.
 */
export function FindYourKona() {
  return (
    <section
      id="find-your-kona"
      aria-labelledby="discovery-heading"
      className="scroll-mt-24 bg-surface-sunken py-24 sm:py-32"
    >
      <noscript>
        {/* Scoped to this section, and parsed only when scripting is off. */}
        <style>{`[data-discovery-interactive]{display:none !important}`}</style>
      </noscript>

      <div className="mx-auto max-w-page px-5 sm:px-8">
        <SectionReveal className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {discovery.eyebrow}
          </p>
          <h2
            id="discovery-heading"
            className="mt-5 font-display text-display-md font-light text-ink"
          >
            {discovery.heading}
          </h2>
        </SectionReveal>

        <SectionReveal className="mt-8">
          <CoffeeDiscovery />
        </SectionReveal>

        <noscript>
          <div className="mt-2">
            <p className="max-w-editorial font-body text-lede text-ink-soft">
              {discovery.intro}
            </p>

            <h3 className="mt-14 font-display text-display-sm font-light text-ink">
              {discovery.fallback.heading}
            </h3>
            <p className="mt-4 max-w-editorial font-body text-base leading-relaxed text-ink-soft">
              {discovery.fallback.intro}
            </p>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-frame border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {discovery.beans.map((bean) => (
                <li key={bean.id} className="bg-surface-raised p-7">
                  <h4 className="font-display text-2xl font-normal text-ink">
                    {bean.name}
                  </h4>
                  <p className="mt-3 font-body text-sm text-ink-muted">
                    {bean.classification} · {bean.roast} roast
                  </p>
                  <p className="mt-4 font-body text-base leading-relaxed text-ink">
                    {bean.flavor}
                  </p>
                  {bean.availability && (
                    <p className="mt-4 font-body text-sm leading-relaxed text-ink">
                      {bean.availability}
                    </p>
                  )}
                  {bean.clarification && (
                    <p className="mt-4 border-l-2 border-highlight pl-4 font-body text-sm leading-relaxed text-ink-soft">
                      {bean.clarification}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                href={discovery.result.viewMenu.href}
                className="inline-flex min-h-14 items-center justify-center rounded-panel bg-surface-inverse px-8 py-4 font-body text-sm tracking-wide text-ink-inverse"
              >
                {discovery.result.viewMenu.label}
              </Link>
            </div>
          </div>
        </noscript>
      </div>
    </section>
  )
}
