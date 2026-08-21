import { SectionReveal } from '@/components/section-reveal'
import { homepage } from '@/content/homepage'

/**
 * The three principles, set editorially rather than as feature cards.
 * No icons: they would add decoration without adding understanding.
 */
export function KonaPrinciples() {
  const { principles } = homepage

  return (
    <section
      id="experience"
      aria-labelledby="principles-heading"
      className="scroll-mt-24 bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <SectionReveal className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {principles.eyebrow}
          </p>
          <h2
            id="principles-heading"
            className="mt-5 font-display text-display-md font-light text-ink"
          >
            {principles.heading}
          </h2>
          <p className="mt-6 font-body text-lede text-ink-soft">
            {principles.intro}
          </p>
        </SectionReveal>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-frame border border-line bg-line sm:mt-20 lg:grid-cols-3">
          {principles.items.map((principle, index) => (
            <SectionReveal
              as="li"
              key={principle.id}
              delayMs={index * 90}
              className="bg-surface-raised p-8 sm:p-10"
            >
              <h3 className="font-display text-2xl font-normal text-ink">
                {principle.title}
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-ink">
                {principle.statement}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
                {principle.detail}
              </p>
            </SectionReveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
