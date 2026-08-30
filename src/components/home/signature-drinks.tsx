'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { showcaseDrinks, type DrinkId } from '@/content/drinks'
import { OrderChooser } from '@/components/order-chooser'

/**
 * Find Your Island Favorite — the signature-drink showcase.
 *
 * A dark editorial product stage, not a card grid: one large transparent
 * product cutout floats over a restrained radial color field that shifts
 * per drink, copy sits beside it, and the selector row is names and compact
 * thumbnails rather than a second row of full photographs. Built as a tab
 * pattern (`role="tablist"`/`"tab"`/`"tabpanel"`), which gives arrow-key
 * navigation and screen-reader semantics for free.
 *
 * Every drink here is real — see `src/content/drinks.ts` for what is
 * confirmed about each — and nothing is rendered for a drink without a real
 * photograph and a real description. Product cutouts are local, non-
 * generative background removal (rembg segmentation): every pixel shown is a
 * real pixel from the original photograph, never generated.
 */

/** One restrained radial atmosphere per drink — never a loud or rainbow gradient. */
const ATMOSPHERE: Record<DrinkId, string> = {
  'kona-island-latte':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-gold-500) 38%, transparent) 0%, color-mix(in srgb, var(--color-espresso-700) 55%, transparent) 45%, transparent 72%)',
  'captain-cook':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-koa-400) 40%, transparent) 0%, color-mix(in srgb, var(--color-espresso-700) 55%, transparent) 45%, transparent 72%)',
  'hilo-ube':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-quiz-ube) 42%, transparent) 0%, color-mix(in srgb, var(--color-espresso-900) 60%, transparent) 45%, transparent 72%)',
  'nutella-latte':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-koa-600) 48%, transparent) 0%, color-mix(in srgb, var(--color-espresso-900) 60%, transparent) 45%, transparent 72%)',
  'island-coco-refresher':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-gold-400) 34%, transparent) 0%, color-mix(in srgb, var(--color-sand-100) 16%, transparent) 40%, transparent 70%)',
  'blue-hawaii-refresher':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-quiz-ocean) 46%, transparent) 0%, color-mix(in srgb, var(--color-espresso-900) 60%, transparent) 45%, transparent 72%)',
  'classic-latte':
    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-gold-500) 30%, transparent) 0%, color-mix(in srgb, var(--color-espresso-700) 55%, transparent) 45%, transparent 72%)',
}

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
      className="scroll-mt-24 bg-espresso-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          Signature Drinks
        </p>
        <h2
          id="signature-drinks-heading"
          className="mt-5 max-w-editorial font-display text-display-md font-light text-sand-50"
        >
          Find Your Island Favorite
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            {/* Selectors: restrained names with compact thumbnails, never a
                second row of full-bleed photographs. */}
            <div
              role="tablist"
              aria-label="Signature drinks"
              onKeyDown={onKeyDown}
              className="flex flex-col gap-1"
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
                  className={`flex items-center gap-3 rounded-panel px-3 py-2.5 text-left font-body text-base transition-colors duration-200 ${
                    index === activeIndex
                      ? 'bg-sand-50/10 text-gold-400'
                      : 'text-sand-100/70 hover:bg-sand-50/5 hover:text-sand-50'
                  }`}
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-espresso-700">
                    <Image
                      src={drink.image.cutout ?? drink.image.src}
                      alt=""
                      fill
                      sizes="40px"
                      className={drink.image.cutout ? 'object-contain p-1' : 'object-cover'}
                    />
                  </span>
                  {drink.name}
                </button>
              ))}
            </div>

            {/* Active drink copy */}
            <div key={active.id} className="discovery-enter mt-9">
              <h3 className="font-display text-3xl font-light text-sand-50 sm:text-4xl">
                {active.name}
              </h3>

              <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                {active.descriptors.map((descriptor) => (
                  <li
                    key={descriptor}
                    className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60 before:mr-3 before:text-sand-100/30 before:content-['—'] first:before:hidden"
                  >
                    {descriptor}
                  </li>
                ))}
              </ul>

              <p className="mt-5 max-w-md font-body text-base leading-relaxed text-sand-100/80">
                {active.description}
              </p>

              <p className="mt-3 font-body text-sm text-sand-100/55">
                {active.temperature.map((t) => (t === 'hot' ? 'Hot' : 'Iced')).join(' · ')}
              </p>

              <div className="relative mt-8">
                <OrderChooser
                  solid={false}
                  align="left"
                  label="Order Ahead"
                  triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Product stage: one large transparent cutout over a restrained
              radial atmosphere that shifts per drink — no card, no white
              image rectangle. */}
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
            {showcaseDrinks.map((drink, index) => (
              <div
                key={drink.id}
                id={`${tablistId}-panel-${drink.id}`}
                role="tabpanel"
                aria-labelledby={`${tablistId}-tab-${drink.id}`}
                hidden={index !== activeIndex}
                className="absolute inset-0"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: ATMOSPHERE[drink.id] }}
                />
                {drink.image.cutout ? (
                  <Image
                    src={drink.image.cutout}
                    alt={drink.image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 90vw, 44rem"
                    className="relative object-contain p-8 drop-shadow-2xl sm:p-10"
                  />
                ) : (
                  <Image
                    src={drink.image.src}
                    alt={drink.image.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 44rem"
                    className="relative rounded-frame object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
