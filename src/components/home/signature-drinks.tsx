'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { showcaseDrinks } from '@/content/drinks'
import { OrderChooser } from '@/components/order-chooser'

/**
 * Find Your Island Favorite — the signature-drink showcase.
 *
 * One dominant photograph and a row of small text/image selectors, not a
 * grid of identical cards: choosing a selector swaps the dominant image and
 * its copy. Built as a tab pattern (`role="tablist"`/`"tab"`/`"tabpanel"`),
 * which gives arrow-key navigation and screen-reader semantics for free
 * rather than reimplementing them by hand.
 *
 * Every drink here is real — see `src/content/drinks.ts` for what is
 * confirmed about each — and nothing is rendered for a drink without a real
 * photograph and a real description.
 */
export function SignatureDrinks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = showcaseDrinks[activeIndex]
  const tablistId = useId()

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % showcaseDrinks.length)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + showcaseDrinks.length) % showcaseDrinks.length)
    }
  }

  return (
    <section
      id="signature-drinks"
      aria-labelledby="signature-drinks-heading"
      className="scroll-mt-24 bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
          Signature Drinks
        </p>
        <h2
          id="signature-drinks-heading"
          className="mt-5 max-w-editorial font-display text-display-md font-light text-ink"
        >
          Find Your Island Favorite
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Dominant image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-surface-sunken lg:order-2">
            {showcaseDrinks.map((drink, index) => (
              <div
                key={drink.id}
                id={`${tablistId}-panel-${drink.id}`}
                role="tabpanel"
                aria-labelledby={`${tablistId}-tab-${drink.id}`}
                hidden={index !== activeIndex}
                className="absolute inset-0"
              >
                <Image
                  src={drink.image.src}
                  alt={drink.image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 44rem"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="lg:order-1">
            {/* Selectors */}
            <div
              role="tablist"
              aria-label="Signature drinks"
              onKeyDown={onKeyDown}
              className="flex flex-wrap gap-2"
            >
              {showcaseDrinks.map((drink, index) => (
                <button
                  key={drink.id}
                  id={`${tablistId}-tab-${drink.id}`}
                  role="tab"
                  type="button"
                  aria-selected={index === activeIndex}
                  aria-controls={`${tablistId}-panel-${drink.id}`}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex items-center gap-2.5 rounded-panel border px-4 py-2.5 font-body text-sm transition-colors duration-200 ${
                    index === activeIndex
                      ? 'border-accent bg-surface-raised text-ink'
                      : 'border-line text-ink-soft hover:border-line-strong hover:text-ink'
                  }`}
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-subtle">
                    <Image
                      src={drink.image.src}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  {drink.name}
                </button>
              ))}
            </div>

            {/* Active drink copy */}
            <div key={active.id} className="discovery-enter mt-9">
              <h3 className="font-display text-3xl font-light text-ink sm:text-4xl">
                {active.name}
              </h3>

              <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {active.descriptors.map((descriptor) => (
                  <li
                    key={descriptor}
                    className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft before:mr-3 before:text-line-strong before:content-['—'] first:before:hidden"
                  >
                    {descriptor}
                  </li>
                ))}
              </ul>

              <p className="mt-5 max-w-md font-body text-base leading-relaxed text-ink-soft">
                {active.description}
              </p>

              <p className="mt-3 font-body text-sm text-ink-muted">
                {active.temperature.map((t) => (t === 'hot' ? 'Hot' : 'Iced')).join(' · ')}
              </p>

              <div className="relative mt-8">
                <OrderChooser
                  solid
                  align="left"
                  label="Order Ahead"
                  triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel bg-surface-inverse px-7 py-3.5 font-body text-sm text-ink-inverse transition-colors duration-200 hover:bg-espresso-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
