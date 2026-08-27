import Image from 'next/image'
import { SectionReveal } from '@/components/section-reveal'
import { homepage } from '@/content/homepage'
import { site } from '@/content/site'
import type { VisitDestination } from '@/content/types'

/**
 * Visit Kona — two destinations, equal weight.
 *
 * The café and the truck are one brand, so neither is a flagship with the
 * other as a footnote: identical structure, identical typographic scale, a
 * two-up grid on desktop and a straight stack on mobile.
 *
 * Deliberately not pricing cards. No badges, no "popular", no comparison
 * columns — two editorial destinations, each with a photograph, an address,
 * and the two things a visitor actually wants: how to get there, and how to
 * order.
 *
 * Every fact here comes from `site.locations` via the homepage content —
 * including the hours, now that the owner has confirmed them. The truck's are
 * the hours of its Valley Medical Center stop and are labelled as such; the
 * truck's other stops are a separate schedule and no claim is made about them
 * here.
 */
export function VisitDestinations() {
  const { visit } = homepage

  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="scroll-mt-24 bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <SectionReveal className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {visit.eyebrow}
          </p>
          <h2
            id="visit-heading"
            className="mt-5 font-display text-display-md font-light text-ink"
          >
            {visit.heading}
          </h2>
          <p className="mt-6 font-body text-lede text-ink-soft">{visit.intro}</p>
        </SectionReveal>

        <ul className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-12">
          {visit.destinations.map((destination, index) => (
            <SectionReveal as="li" key={destination.id} delayMs={index * 90}>
              <DestinationCard destination={destination} priority={index === 0} />
            </SectionReveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DestinationCard({
  destination,
  priority,
}: {
  destination: VisitDestination
  priority: boolean
}) {
  const { image, primary, secondary } = destination
  /* Read straight from the verified location record, not from the homepage
     copy, so a time cannot drift between the two. */
  const hours = site.locations.find((l) => l.id === destination.id)!.hours

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-frame border border-line bg-surface-raised">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken">
        {image.src ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 38rem"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <h3 className="font-display text-2xl font-normal text-ink sm:text-3xl">
          {destination.label}
        </h3>

        <p className="mt-3 font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft">
          {destination.place}
        </p>

        <p className="mt-5 font-body text-base leading-relaxed text-ink-soft">
          {destination.description}
        </p>

        {hours.state === 'verified' && hours.value.length > 0 ? (
          <dl className="mt-5 font-body text-base leading-relaxed text-ink-soft">
            {/* Each line names its own place, so the heading does not have to
                — and must not, now that the truck's week covers two of them. */}
            <dt className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
              Hours
            </dt>
            {hours.value.map((line) => (
              <dd key={line} className="ml-0">
                {line}
              </dd>
            ))}
          </dl>
        ) : null}

        {/* mt-auto keeps both cards' actions on the same line when the two
            descriptions differ in length. */}
        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:gap-4">
          <ExternalAction action={primary} tone="primary" />
          <ExternalAction action={secondary} tone="secondary" />
        </div>
      </div>
    </article>
  )
}

function ExternalAction({
  action,
  tone,
}: {
  action: VisitDestination['primary']
  tone: 'primary' | 'secondary'
}) {
  const base =
    'inline-flex min-h-14 flex-1 items-center justify-center rounded-panel px-6 py-4 text-center font-body text-sm tracking-wide transition-[background-color,border-color,transform] duration-200 ease-calm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px'

  const skin =
    tone === 'primary'
      ? 'bg-surface-inverse text-ink-inverse hover:bg-espresso-700'
      : 'border border-ink-soft text-ink hover:bg-sand-100'

  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${skin}`}
    >
      {action.label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
