'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { showcaseDrinks, type DrinkId } from '@/content/drinks'
import { OrderChooser } from '@/components/order-chooser'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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

// Hilo Ube opens the showcase — the hero above already sells the Kona Island
// Latte, so this section's first impression is a different drink. Looked up
// by id rather than a hardcoded index so it stays correct if the declaration
// order in `drinks.ts` (which the quiz's tie-breaks depend on) ever changes.
const DEFAULT_DRINK_ID: DrinkId = 'hilo-ube'

export function SignatureDrinks() {
  const [activeIndex, setActiveIndex] = useState(() => {
    const index = showcaseDrinks.findIndex((drink) => drink.id === DEFAULT_DRINK_ID)
    return index === -1 ? 0 : index
  })
  const active = showcaseDrinks[activeIndex]
  const tablistId = useId()
  const prefersReducedMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement | null>(null)
  const skipNextScroll = useRef(true)

  // Below `lg` the selector, product stage and copy stack in that order (see
  // the JSX below), so on a narrow screen the stage can land out of view —
  // below the selector, above the copy, or both. `block: 'nearest'` moves
  // only as far as required to bring it fully into view (a no-op if it's
  // already visible, which is always true at `lg:`, where the stage sits
  // beside the selector) — never centers it, never fights the sticky header
  // (the page's own `scroll-padding-top` already accounts for that). Skipped
  // on mount so opening the section doesn't itself trigger a scroll.
  useEffect(() => {
    if (skipNextScroll.current) {
      skipNextScroll.current = false
      return
    }
    stageRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [activeIndex, prefersReducedMotion])

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

        {/*
          Below `lg` this is a single column and source order is visual
          order, so it's deliberately selector → stage → copy: tap a
          selector and the product it names is the very next thing on the
          page, not buried under a tall list and a paragraph. At `lg:` the
          original two-column composition returns via explicit grid
          placement (`order-none` lets col/row-start fully decide position) —
          selector and copy stacked in the narrow column, the stage alone in
          the wide one, exactly as before.
        */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-16 lg:gap-y-10">
          {/* Selectors: a compact horizontally-scrollable row of names and
              thumbnails on mobile — never a tall list that pushes the
              product below the fold — reverting to the original vertical
              list at `lg:`. */}
          <div
            role="tablist"
            aria-label="Signature drinks"
            onKeyDown={onKeyDown}
            className="order-1 min-w-0 flex gap-2 overflow-x-auto pb-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
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
                className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-panel px-3 py-2 text-left font-body text-sm transition-colors duration-200 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-base ${
                  index === activeIndex
                    ? 'bg-sand-50/10 text-gold-400'
                    : 'text-sand-100/70 hover:bg-sand-50/5 hover:text-sand-50'
                }`}
              >
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-espresso-700 lg:h-10 lg:w-10">
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

          {/* Product stage: one large transparent cutout over a restrained
              radial atmosphere that shifts per drink — no card, no white
              image rectangle. */}
          <div
            ref={stageRef}
            className="order-2 relative aspect-[4/5] scroll-mt-24 sm:aspect-[5/4] lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:aspect-[4/5]"
          >
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

          {/* Active drink copy */}
          <div
            key={active.id}
            className="discovery-enter order-3 lg:order-none lg:col-start-1 lg:row-start-2"
          >
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
      </div>
    </section>
  )
}
