import Link from 'next/link'
import Image from 'next/image'
import { chimneyCakeSection, foodItems } from '@/content/food'

/**
 * Chimney cakes and breakfast — the food section.
 *
 * One large, asymmetric dominant photograph (the dragonfruit chimney cake's
 * spiral is the emotional focal point) beside a smaller product stage and two
 * editorial labels, on the same dark ground as the rest of the homepage. A
 * Server Component: nothing here is interactive.
 *
 * The dragonfruit chimney cake is deliberately never cut out — its hand, the
 * stretched spiral and the café setting are the photograph's point, and
 * removing the background would remove exactly what makes it work. The other
 * three items use local, non-generative background-removed cutouts (rembg
 * segmentation — every pixel shown is a real pixel from the source photo)
 * so they read as premium product objects rather than photos dropped onto a
 * white rectangle.
 */
export function ChimneyCakes() {
  const dominant = foodItems.find((item) => item.dominant)!
  const supporting = foodItems.filter((item) => !item.dominant)
  const [breakfastFeature, ...editorial] = supporting

  return (
    <section
      aria-labelledby="chimney-cakes-heading"
      className="scroll-mt-24 bg-espresso-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          {chimneyCakeSection.eyebrow}
        </p>
        <h2
          id="chimney-cakes-heading"
          className="mt-5 max-w-editorial font-display text-display-md font-light text-sand-50"
        >
          {chimneyCakeSection.heading}
        </h2>
        <p className="mt-6 max-w-editorial font-body text-lede text-sand-100/80">
          {chimneyCakeSection.intro}
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Dominant: the chimney cake, unchanged and uncut — its authentic
              hand, spiral and café setting are the image. */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-espresso-700">
              <Image
                src={dominant.image.src}
                alt={dominant.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 56rem"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso-900/50 via-transparent to-transparent"
              />
            </div>
            <h3 className="mt-6 font-display text-3xl font-light text-sand-50 sm:text-4xl">
              {chimneyCakeSection.dominantHeading}
            </h3>
            <p className="mt-3 max-w-sm font-body text-base leading-relaxed text-sand-100/75">
              {chimneyCakeSection.dominantCopy}
            </p>
          </div>

          {/* Supporting: one product stage for the breakfast feature, offset
              above two editorial labels rather than a matching pair of cards. */}
          <div className="lg:col-span-5 lg:pt-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-frame">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-quiz-coral) 30%, transparent) 0%, color-mix(in srgb, var(--color-espresso-700) 55%, transparent) 45%, transparent 72%)',
                }}
              />
              {breakfastFeature.image.cutout ? (
                <Image
                  src={breakfastFeature.image.cutout}
                  alt={breakfastFeature.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34rem"
                  className="relative object-contain p-10 drop-shadow-2xl"
                />
              ) : (
                <Image
                  src={breakfastFeature.image.src}
                  alt={breakfastFeature.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34rem"
                  className="relative object-cover"
                />
              )}
            </div>
            <p className="mt-4 font-body text-base text-sand-100/80">{breakfastFeature.name}</p>

            <ul className="mt-8 flex flex-col gap-4 border-t border-sand-50/15 pt-6">
              {editorial.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-espresso-700">
                    <Image
                      src={item.image.cutout ?? item.image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className={item.image.cutout ? 'object-contain p-1.5' : 'object-cover'}
                    />
                  </span>
                  <span className="font-body text-base text-sand-50">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href={chimneyCakeSection.action.href}
            className="inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-8 py-4 font-body text-sm tracking-wide text-charcoal-900 transition-colors duration-200 hover:bg-white"
          >
            {chimneyCakeSection.action.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
