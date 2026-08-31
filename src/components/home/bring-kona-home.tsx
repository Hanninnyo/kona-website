'use client'

import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { beans, bringKonaHome, type Bean } from '@/content/beans'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Bring Kona Home — the retail bean section.
 *
 * No package photography exists for any of these beans (checked against
 * both supplied image packages and the rest of the repository), so this is
 * a typography-led editorial treatment rather than a product-card grid with
 * an empty image slot pretending to be a photograph. A farm/origin
 * photograph anchors the section instead — the same authentic image the
 * origin invitation uses lower on the page, at a different crop.
 *
 * The action is a plain external link straight to the Mountain View Square
 * account (`orderingUrls.mountainView` via `bringKonaHome.action.href`) —
 * deliberately not the café/truck `OrderChooser` used for drinks, because
 * retail bags are owner-confirmed Mountain View pickup only. Offering the
 * truck as a choice here would be wrong, not just imprecise.
 */
export function BringKonaHome() {
  const [activeId, setActiveId] = useState(beans[0].id)
  const active = beans.find((b) => b.id === activeId)!
  const listId = useId()
  const prefersReducedMotion = useReducedMotion()
  const detailRef = useRef<HTMLDivElement | null>(null)
  const skipNextScroll = useRef(true)

  // Same reasoning as the signature-drinks selector: below `lg` the detail
  // panel already renders right after the selector in source order, but a
  // visitor could still have scrolled such that it's not fully in view when
  // they tap. `nearest` moves only as far as required — a no-op at `lg:`,
  // where the detail sits beside the selector and is already visible.
  useEffect(() => {
    if (skipNextScroll.current) {
      skipNextScroll.current = false
      return
    }
    detailRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [activeId, prefersReducedMotion])

  return (
    <section
      aria-labelledby="bring-kona-home-heading"
      className="scroll-mt-24 py-24 text-sand-50 sm:py-32"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--color-koa-600) 30%, transparent) 0%, transparent 55%), var(--color-espresso-900)',
      }}
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          {bringKonaHome.eyebrow}
        </p>
        <h2
          id="bring-kona-home-heading"
          className="mt-5 max-w-editorial font-display text-display-md font-light text-sand-50"
        >
          {bringKonaHome.heading}
        </h2>
        <p className="mt-6 max-w-editorial font-body text-lede text-sand-100/80">
          {bringKonaHome.intro}
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* `min-w-0`: without it, a grid item sizes to its content's
              intrinsic (min-content) width by default, so the horizontally-
              scrollable tablist below — wider than the viewport by design —
              would force this whole grid track wider than the page instead
              of scrolling internally, shifting the entire section sideways
              the moment a tab past the fold received focus. Reproduced by
              selecting the last chip (which the browser auto-scrolls to
              reveal) before this fix. */}
          <div className="min-w-0">
            {/* Mobile/tablet (<lg): one compact horizontally-scrollable row,
                flattened across groups — never a tall list that pushes the
                selected bean's price below the fold. */}
            <div
              role="tablist"
              aria-label="Kona coffees"
              className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
            >
              {beans.map((bean) => {
                const isSelected = bean.id === activeId
                return (
                  <button
                    key={bean.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveId(bean.id)}
                    className={`shrink-0 whitespace-nowrap rounded-panel px-4 py-2.5 text-left font-display text-lg transition-colors duration-200 ${
                      isSelected
                        ? 'bg-sand-50/10 text-gold-400'
                        : 'text-sand-100/80 hover:bg-sand-50/5 hover:text-sand-50'
                    }`}
                  >
                    {bean.name}
                  </button>
                )
              })}
            </div>

            {/* `lg:` and up: the original grouped vertical list. */}
            <div
              role="tablist"
              aria-label="Kona coffees"
              className="hidden lg:flex lg:flex-col lg:gap-8"
            >
              {bringKonaHome.groups.map((group) => (
                <div key={group.label}>
                  <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60">
                    {group.label}
                  </p>
                  <ul id={`${listId}-${group.label}`} className="mt-4 flex flex-col gap-1">
                    {group.beanIds.map((id) => {
                      const bean = beans.find((b) => b.id === id)!
                      const isSelected = bean.id === activeId
                      return (
                        <li key={bean.id}>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            onClick={() => setActiveId(bean.id)}
                            className={`w-full rounded-panel px-4 py-3 text-left font-display text-xl transition-colors duration-200 ${
                              isSelected
                                ? 'bg-sand-50/10 text-gold-400'
                                : 'text-sand-100/80 hover:bg-sand-50/5 hover:text-sand-50'
                            }`}
                          >
                            {bean.name}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <BeanDetail ref={detailRef} bean={active} />
        </div>

        <div className="mt-14 flex flex-col gap-4">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60">
            {bringKonaHome.availabilityLabel}
          </p>
          <a
            href={bringKonaHome.action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 w-fit items-center justify-center rounded-panel border border-sand-50/45 px-8 py-4 font-body text-sm tracking-wide text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
          >
            {bringKonaHome.action.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}

const BeanDetail = forwardRef<HTMLDivElement, { bean: Bean }>(function BeanDetail(
  { bean },
  ref
) {
  return (
    <div
      ref={ref}
      key={bean.id}
      className="discovery-enter scroll-mt-24 border-t border-sand-50/15 pt-10 lg:border-t-0 lg:border-l lg:pl-16 lg:pt-0"
    >
      <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60">
        {bean.classification}
      </p>
      <h3 className="mt-3 font-display text-4xl font-light text-sand-50 sm:text-5xl">
        {bean.name}
      </h3>
      <p className="mt-2 font-body text-sm text-sand-100/70">{bean.descriptor}</p>

      <dl className="mt-8 flex flex-col gap-3">
        {bean.prices.map((price) => (
          <div key={price.size} className="flex items-baseline justify-between border-b border-sand-50/10 pb-3 font-body">
            <dt className="text-sand-100/75">{price.size}</dt>
            <dd className="text-lg text-sand-50">${price.amount.toFixed(2)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
})
