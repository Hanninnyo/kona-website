import { MediaFrame } from '@/components/media-frame'
import { SectionReveal } from '@/components/section-reveal'
import { homepage } from '@/content/homepage'

/**
 * The Space — large photography with magazine pacing.
 *
 * Structure is complete and responsive; the two image slots render honest
 * placeholders until approved interior photography is delivered.
 */
export function SpaceEditorial() {
  const { space } = homepage
  const [wide, detail] = space.images

  return (
    <section
      aria-labelledby="space-heading"
      className="bg-surface-raised py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <SectionReveal className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {space.eyebrow}
          </p>
          <h2
            id="space-heading"
            className="mt-5 font-display text-display-md font-light text-ink"
          >
            {space.heading}
          </h2>
          <div className="mt-6 space-y-1">
            {space.lines.map((line) => (
              <p
                key={line}
                className="font-display text-display-sm font-light text-ink-muted"
              >
                {line}
              </p>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="mt-14 sm:mt-20">
          <MediaFrame
            slot={wide}
            sizes="(max-width: 1024px) 100vw, 78rem"
            className="w-full"
          />
        </SectionReveal>

        <div className="mt-14 grid items-start gap-12 sm:mt-20 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <SectionReveal>
            <MediaFrame
              slot={detail}
              sizes="(max-width: 1024px) 100vw, 32rem"
              className="w-full"
            />
          </SectionReveal>

          <SectionReveal delayMs={90} className="lg:pt-8">
            <p className="max-w-editorial font-body text-lede text-ink-soft">
              {space.body}
            </p>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
