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
      <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/65">
        {quizContent.result.heading}
      </p>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 max-w-editorial font-display text-display-md font-light text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
      >
        {primary.drink.name}
      </h3>

      <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        {primary.drink.descriptors.map((descriptor) => (
          <li
            key={descriptor}
            className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60 before:mr-3 before:text-sand-100/30 before:content-['—'] first:before:hidden"
          >
            {descriptor}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 sm:grid-cols-[14rem_1fr] sm:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-espresso-700">
          {primary.drink.image.cutout ? (
            <Image
              src={primary.drink.image.cutout}
              alt={primary.drink.image.alt}
              fill
              sizes="14rem"
              className="object-contain p-4"
            />
          ) : (
            <Image
              src={primary.drink.image.src}
              alt={primary.drink.image.alt}
              fill
              sizes="14rem"
              className="object-cover"
            />
          )}
        </div>

        <div>
          <p className="max-w-md font-body text-base leading-relaxed text-sand-100/80">
            {primary.drink.description}
          </p>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <OrderChooser
              solid={false}
              align="left"
              label={quizContent.result.primaryAction}
              triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel bg-sand-50 px-8 py-4 font-body text-sm tracking-wide text-charcoal-900 transition-colors duration-200 hover:bg-white"
            />
            <button
              type="button"
              onClick={onStartAgain}
              className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/30 px-7 py-4 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50/60"
            >
              {quizContent.result.secondaryAction}
            </button>
          </div>
        </div>
      </div>

      {secondary.drink.id !== primary.drink.id && (
        <div className="mt-10 flex items-center gap-4 border-t border-sand-50/15 pt-8">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-espresso-700">
            <Image
              src={secondary.drink.image.cutout ?? secondary.drink.image.src}
              alt=""
              fill
              sizes="56px"
              className={secondary.drink.image.cutout ? 'object-contain p-1.5' : 'object-cover'}
            />
          </span>
          <p className="font-body text-sm text-sand-100/75">
            Also worth trying — <span className="text-sand-50">{secondary.drink.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}
