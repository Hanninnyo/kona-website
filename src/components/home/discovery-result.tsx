'use client'

import Image from 'next/image'
import Link from 'next/link'
import { discovery } from '@/content/discovery'
import type { DiscoveryImage, DiscoveryTag } from '@/content/types'
import {
  describeSelections,
  type Recommendation,
} from '@/lib/discovery/recommendation'

/**
 * The revealed match: one coffee and one café drink.
 *
 * The two are independent recommendations connected by flavour and mood. The
 * copy here never says or implies that the café drink is prepared with the
 * recommended retail coffee, and the standfirst says so plainly.
 *
 * The result deliberately offers no internal coffee link: the /coffee route
 * still carries unapproved legacy content. Everything a visitor needs about
 * the recommended bean — classification, roast, flavour, availability — is on
 * the card itself, so the experience is complete without it.
 *
 * Each card carries an image placement that activates the moment approved
 * photography is added to the content file. Until then the card is a
 * deliberate typographic composition rather than an empty frame, and nothing
 * owner-facing — no "photography pending" notice — is shown to a visitor.
 */

interface DiscoveryResultProps {
  recommendation: Recommendation
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onStartAgain: () => void
}

/** Only the strongest few descriptors, so the result stays composed. */
const MAX_DESCRIPTORS = 4

/**
 * The small flavour descriptors that gather around a result: either the
 * visitor's own answers, or the tags that actually earned a recommendation its
 * score. Rendered as a list so the relationship is programmatic, not visual.
 */
function Descriptors({ items, className = '' }: { items: string[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <ul className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      {items.map((item, index) => (
        <li
          key={item}
          // A short, staggered settle so the descriptors gather rather than
          // appear all at once. Neutralised under reduced motion.
          className="discovery-gather font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft before:mr-3 before:text-line-strong before:content-['—'] first:before:hidden"
          style={{ animationDelay: `${140 + index * 90}ms` }}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Matched tags, capped and turned into display labels. */
function descriptorLabels(tags: DiscoveryTag[]): string[] {
  return tags.slice(0, MAX_DESCRIPTORS).map((tag) => discovery.tagLabels[tag])
}

function CardImage({ image }: { image: DiscoveryImage }) {
  // Ready for approved photography; renders nothing while none exists, so the
  // card never shows a hole.
  if (!image.src) return null

  return (
    <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-frame bg-surface-sunken">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 34rem"
        className="object-cover"
      />
    </div>
  )
}

export function DiscoveryResult({
  recommendation,
  headingRef,
  onStartAgain,
}: DiscoveryResultProps) {
  const { bean, drink, selections, decafRequested } = recommendation
  const { result } = discovery
  const asked = describeSelections(selections)

  return (
    <div className="discovery-enter">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-display-sm font-light text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {result.heading}
      </h3>

      {/* The visitor's own answers, gathered under the result. */}
      <Descriptors
        items={selections.map((option) => option.label)}
        className="mt-6"
      />

      {/* States plainly that the two are independent. Nothing anywhere in this
          result says or implies the café drink is made with the coffee. */}
      <p className="mt-6 max-w-editorial font-body text-lede text-ink-soft">
        You asked for {asked}. Two separate introductions for that moment: a
        coffee to brew, and a drink to order at the café.
      </p>

      <div className="mt-12 grid gap-px overflow-hidden rounded-frame border border-line bg-line lg:grid-cols-2">
        {/* --- The coffee ------------------------------------------------ */}
        <article className="bg-surface-raised p-7 sm:p-10">
          <CardImage image={bean.item.image} />

          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {result.beanLabel}
          </p>
          <h4 className="mt-4 font-display text-2xl font-normal text-ink sm:text-3xl">
            {bean.item.name}
          </h4>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4">
            <div>
              <dt className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
                Coffee
              </dt>
              <dd className="mt-1 font-body text-sm text-ink">
                {bean.item.classification}
              </dd>
            </div>
            <div>
              <dt className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
                Roast
              </dt>
              <dd className="mt-1 font-body text-sm text-ink">{bean.item.roast}</dd>
            </div>
          </dl>

          <p className="mt-5 font-body text-base leading-relaxed text-ink">
            {bean.item.flavor}
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
            {bean.item.personality}
          </p>

          {bean.item.availability && (
            <p className="mt-5 font-body text-sm leading-relaxed text-ink">
              {bean.item.availability}
            </p>
          )}

          {bean.item.clarification && (
            <p className="mt-5 border-l-2 border-highlight pl-4 font-body text-sm leading-relaxed text-ink-soft">
              {bean.item.clarification}
            </p>
          )}

          <h5 className="mt-8 font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
            Why this one
          </h5>
          <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">
            {bean.item.rationale}
          </p>

          <Descriptors items={descriptorLabels(bean.matchedTags)} className="mt-6" />
        </article>

        {/* --- The café drink -------------------------------------------- */}
        <article className="bg-surface-raised p-7 sm:p-10">
          <CardImage image={drink.item.image} />

          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {result.drinkLabel}
          </p>
          <h4 className="mt-4 font-display text-2xl font-normal text-ink sm:text-3xl">
            {drink.item.name}
          </h4>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4">
            <div>
              <dt className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
                Flavor
              </dt>
              <dd className="mt-1 font-body text-sm text-ink">{drink.item.flavor}</dd>
            </div>
          </dl>

          {drink.item.position && (
            <p className="mt-5 font-body text-sm leading-relaxed text-ink-muted">
              {drink.item.position}
            </p>
          )}

          {decafRequested && drink.item.espressoBased && (
            <p className="mt-5 font-body text-sm leading-relaxed text-ink">
              {result.decafDrinkAvailability}
            </p>
          )}

          <h5 className="mt-8 font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
            Why it complements
          </h5>
          <p className="mt-3 font-body text-base leading-relaxed text-ink-soft">
            {drink.item.rationale}
          </p>

          <Descriptors items={descriptorLabels(drink.matchedTags)} className="mt-6" />
        </article>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Link
          href={result.viewMenu.href}
          className="inline-flex min-h-14 items-center justify-center rounded-panel bg-surface-inverse px-8 py-4 font-body text-sm tracking-wide text-ink-inverse transition-colors duration-200 hover:bg-espresso-700"
        >
          {result.viewMenu.label}
        </Link>
        <button
          type="button"
          onClick={onStartAgain}
          className="inline-flex min-h-14 items-center justify-center rounded-panel px-4 py-4 font-body text-sm text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-accent sm:px-2"
        >
          {result.startAgainLabel}
        </button>
      </div>
    </div>
  )
}
