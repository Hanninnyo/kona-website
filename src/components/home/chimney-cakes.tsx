import Link from 'next/link'
import Image from 'next/image'
import { chimneyCakeSection, foodItems } from '@/content/food'

/**
 * Chimney cakes and breakfast — the food section.
 *
 * One large, asymmetric dominant photograph (the dragonfruit chimney cake's
 * spiral is the emotional focal point) beside a smaller clean breakfast shot,
 * with the remaining two items as restrained editorial labels rather than a
 * fourth and fifth identical card. A Server Component: nothing here is
 * interactive.
 */
export function ChimneyCakes() {
  const dominant = foodItems.find((item) => item.dominant)!
  const supporting = foodItems.filter((item) => !item.dominant)
  const [breakfastFeature, ...editorial] = supporting

  return (
    <section
      aria-labelledby="chimney-cakes-heading"
      className="scroll-mt-24 bg-surface-sunken py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
          {chimneyCakeSection.eyebrow}
        </p>
        <h2
          id="chimney-cakes-heading"
          className="mt-5 max-w-editorial font-display text-display-md font-light text-ink"
        >
          {chimneyCakeSection.heading}
        </h2>
        <p className="mt-6 max-w-editorial font-body text-lede text-ink-soft">
          {chimneyCakeSection.intro}
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Dominant: the chimney cake, asymmetric and larger */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-surface">
              <Image
                src={dominant.image.src}
                alt={dominant.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 56rem"
                className="object-cover"
              />
            </div>
            <h3 className="mt-6 font-display text-3xl font-light text-ink sm:text-4xl">
              {chimneyCakeSection.dominantHeading}
            </h3>
            <p className="mt-3 max-w-sm font-body text-base leading-relaxed text-ink-soft">
              {chimneyCakeSection.dominantCopy}
            </p>
          </div>

          {/* Supporting: one clean breakfast photograph, offset above two
              editorial labels rather than a matching pair of cards. */}
          <div className="lg:col-span-5 lg:pt-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-surface">
              <Image
                src={breakfastFeature.image.src}
                alt={breakfastFeature.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 34rem"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-body text-base text-ink-soft">{breakfastFeature.name}</p>

            <ul className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
              {editorial.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-subtle bg-surface">
                    <Image
                      src={item.image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span className="font-body text-base text-ink">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href={chimneyCakeSection.action.href}
            className="inline-flex min-h-14 items-center justify-center rounded-panel bg-surface-inverse px-8 py-4 font-body text-sm tracking-wide text-ink-inverse transition-colors duration-200 hover:bg-espresso-700"
          >
            {chimneyCakeSection.action.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
