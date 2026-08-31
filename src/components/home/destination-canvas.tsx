import Image from 'next/image'
import { homepage } from '@/content/homepage'
import { site } from '@/content/site'

/**
 * Two Ways to Find Your Island Escape — the café/truck panels.
 *
 * Both destinations are visible at once — side by side on desktop, stacked
 * on mobile — replacing the previous single-image tab toggle (still on disk
 * as the exported `DestinationCanvas` name, just entirely rewritten): a
 * visitor comparing the café and the truck should never have to click to see
 * the one they didn't land on first. Every fact still reads from
 * `site.locations` via `homepage.visit`, so nothing here can drift from the
 * rest of the site.
 *
 * The truck photo is the one authentic photograph available — the two other
 * truck images in `public/images/truck` are AI-generated (visible generator
 * watermark) and are deliberately never used, here or anywhere else on the
 * site. It shows both Hanna and Jorge, one on each far side of a very wide
 * (7952×5304, ~1.5:1) launch photo — too wide for any `object-cover` crop
 * inside a portrait panel to keep both of them in frame at once; a crop
 * tight enough to show the round logo cut Jorge out entirely, and centering
 * cropped both of them. So the truck panel doesn't crop at all: the full,
 * uncropped photograph sits in its own `object-contain` zone (real pixels,
 * no re-crop, no re-composition), with a heavily blurred, dark-tinted copy
 * of the very same photo filling the space `contain` leaves empty — never a
 * flat void, never a second photo. The schedule and actions live in a solid
 * panel below the image zone, in normal flow rather than overlaid on it, so
 * text can never sit across either of their faces.
 *
 * Sweet crêpes are a truck-only fact enforced at the content layer
 * (`food.ts`, `/pastries`) and are not referenced here at all.
 */
export function DestinationCanvas() {
  const { visit } = homepage
  const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
  const coffeeTruck = site.locations.find((l) => l.id === 'coffee-truck')!
  const cafe = visit.destinations.find((d) => d.id === 'mountain-view')!
  const truck = visit.destinations.find((d) => d.id === 'coffee-truck')!

  return (
    <section aria-labelledby="destinations-heading" className="bg-espresso-900 py-24 sm:py-32">
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          {visit.eyebrow}
        </p>
        <h2
          id="destinations-heading"
          className="mt-5 max-w-xl font-display text-display-md font-light text-sand-50"
        >
          Two Ways to Find Your Island Escape
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-page gap-4 px-5 sm:px-8 lg:grid-cols-2 lg:gap-6">
        {/* Café panel */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-charcoal-900 sm:aspect-[3/4] lg:aspect-[4/5]">
          <Image
            src={cafe.image.src!}
            alt={cafe.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-charcoal-900/95 via-charcoal-900/45 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Mountain View Café
            </p>
            <p className="mt-3 font-body text-base text-sand-50">
              {mountainView.address.street}, {formatUnit(mountainView.address.unit)}
            </p>
            <p className="font-body text-base text-sand-50">{mountainView.address.city}</p>

            {mountainView.hours.state === 'verified' && (
              <dl className="mt-3 font-body text-sm leading-relaxed text-sand-100/80">
                {mountainView.hours.value.map((line) => (
                  <dd key={line}>{line}</dd>
                ))}
              </dl>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={cafe.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-6 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
              >
                Visit the Café
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={cafe.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/45 px-6 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
              >
                Order Café Pickup
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Truck panel — image zone (full uncropped photo over a blurred
            fill) and text zone are separate flex children in normal flow,
            not stacked layers, so the schedule can never overlap either
            person in the photo. Below `lg` the panel's height is organic
            (image zone's own min-height plus the text block's natural
            height) rather than a fixed aspect ratio: the schedule here runs
            three entries deep, and locking to the café panel's aspect ratio
            on a narrow phone left it barely 7px of image — the photo would
            all but vanish. At `lg:` the panel is wide enough that the same
            aspect ratio leaves the image zone comfortable room, so it
            matches the café panel exactly, keeping both equally prominent. */}
        <div className="flex flex-col overflow-hidden rounded-frame bg-charcoal-900 lg:aspect-[4/5]">
          <div className="relative min-h-56 flex-1 sm:min-h-64 lg:min-h-0">
            {/* Blurred, dark-tinted fill — the same photograph, never a
                second image — so `object-contain`'s empty margins are never
                a flat void. Strictly decorative. */}
            <Image
              aria-hidden="true"
              src={truck.image.src!}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="scale-110 object-cover blur-2xl"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-charcoal-900/55" />
            {/* The complete, uncropped photograph — real pixels, no crop,
                no re-composition — so both Hanna and Jorge stay in frame. */}
            <Image
              src={truck.image.src!}
              alt={truck.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="relative object-contain"
            />
          </div>

          <div className="bg-gradient-to-b from-charcoal-900 to-espresso-900 p-6 sm:p-8">
            <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Kona Coffee Truck
            </p>

            <dl className="mt-3 flex flex-col gap-3 font-body text-sm leading-relaxed text-sand-100/80">
              {coffeeTruck.schedule?.map((block) => (
                <div key={block.label}>
                  <dt className="text-sand-50">{block.label}</dt>
                  <dd>{block.when}</dd>
                  {block.note && <dd className="text-sand-100/60">{block.note}</dd>}
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={truck.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-6 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
              >
                Directions to VMC
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={truck.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/45 px-6 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
              >
                Order from the Truck
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** "STE 84" → "Suite 84" for display; the canonical value stays abbreviated in `site.ts`. */
function formatUnit(unit: string | undefined): string {
  if (!unit) return ''
  return unit.replace(/^STE\.?\s*/i, 'Suite ')
}
