'use client'

import Image from 'next/image'
import { quizContent } from '@/content/kona-quiz'
import { OrderChooser } from '@/components/order-chooser'
import type { QuizRecommendation } from '@/lib/kona-quiz/recommend'

interface Props {
  recommendation: QuizRecommendation
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onStartAgain: () => void
}

/**
 * The revealed match. Not gated by email — the result shows in full before
 * any save option would appear, and no save form is rendered in this build
 * (see the Checkpoint 2 report for why).
 */
export function KonaQuizResult({ recommendation, headingRef, onStartAgain }: Props) {
  const { primary, secondary } = recommendation

  return (
    <div>
      <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft">
        {quizContent.result.heading}
      </p>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 max-w-editorial font-display text-display-md font-light text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {primary.drink.name}
      </h3>

      <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        {primary.drink.descriptors.map((descriptor) => (
          <li
            key={descriptor}
            className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft before:mr-3 before:text-line-strong before:content-['—'] first:before:hidden"
          >
            {descriptor}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 sm:grid-cols-[14rem_1fr] sm:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-surface-sunken">
          <Image
            src={primary.drink.image.src}
            alt={primary.drink.image.alt}
            fill
            sizes="14rem"
            className="object-cover"
          />
        </div>

        <div>
          <p className="max-w-md font-body text-base leading-relaxed text-ink-soft">
            {primary.drink.description}
          </p>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <OrderChooser
              solid
              align="left"
              label={quizContent.result.primaryAction}
              triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel bg-surface-inverse px-8 py-4 font-body text-sm tracking-wide text-ink-inverse transition-colors duration-200 hover:bg-espresso-700"
            />
            <button
              type="button"
              onClick={onStartAgain}
              className="inline-flex min-h-14 items-center justify-center rounded-panel border border-line-strong px-7 py-4 font-body text-sm text-ink transition-colors duration-200 hover:border-ink-soft"
            >
              {quizContent.result.secondaryAction}
            </button>
          </div>
        </div>
      </div>

      {secondary.drink.id !== primary.drink.id && (
        <div className="mt-10 flex items-center gap-4 border-t border-line pt-8">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-subtle bg-surface-sunken">
            <Image src={secondary.drink.image.src} alt="" fill sizes="56px" className="object-cover" />
          </span>
          <p className="font-body text-sm text-ink-soft">
            Also worth trying — <span className="text-ink">{secondary.drink.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}
