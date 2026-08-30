'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { quizContent } from '@/content/kona-quiz'
import {
  getLiveRanking,
  isQuizComplete,
  recommendDrinks,
  type LiveRankEntry,
  type QuizAnswers,
} from '@/lib/kona-quiz/recommend'
import { drinks, type DrinkId } from '@/content/drinks'
import { KonaQuizResult } from '@/components/home/kona-quiz-result'

/**
 * Find Your Kona — the five-question drink quiz.
 *
 * Structurally the same accessible shape as the existing bean-and-drink
 * consultation in `coffee-discovery.tsx` (a real radio fieldset per step,
 * focus moved to the new heading on a deliberate step change, Continue
 * revealed only once an answer exists) — proven UX, new content and new
 * scoring, kept deliberately separate rather than mutating the verified
 * `discovery.ts` module.
 *
 * Entirely local and synchronous: no network call, no persistence, no URL
 * state. Anonymous analytics events are designed in the schema below but
 * none are actually emitted — nothing in this component calls out anywhere.
 *
 * ── Anonymous event schema (designed, not wired) ──────────────────────────
 * quiz_started        {}
 * quiz_answered       { question: string, option: string }
 * quiz_completed       {}
 * quiz_result          { primary: DrinkId, secondary: DrinkId }
 * quiz_restarted        {}
 * order_match_clicked  { drink: DrinkId }
 * Every field above is a controlled categorical value or a known id — never a
 * name, an email, or free text — matching the constraint this quiz was built
 * under. See the Checkpoint 2 report for where this would connect.
 */

type Stage = { kind: 'invitation' } | { kind: 'question'; index: number } | { kind: 'result' }

const questions = quizContent.questions
const totalSteps = questions.length

/**
 * Four real, photographed drinks with clean cutouts, chosen for color range
 * (gold/espresso, violet, coconut, ocean blue) — never all seven, which would
 * read as a cluttered grid rather than a handful of drinks glimpsed at
 * different depths. Reused for the intro visual and, live, through every
 * question: `getLiveRanking` fades a drink out once an answer eliminates it
 * (a hot answer against an iced-only refresher) and brightens whichever is
 * currently the closer match — never revealing the final result early, since
 * the ranking only ever reflects the questions answered so far.
 */
const FEATURED_DRINK_IDS: DrinkId[] = [
  'kona-island-latte',
  'hilo-ube',
  'island-coco-refresher',
  'blue-hawaii-refresher',
]

const FEATURED_LAYOUT: Partial<Record<DrinkId, string>> = {
  'kona-island-latte': 'right-2 top-6 h-56 w-56 rotate-[3deg]',
  'hilo-ube': 'left-0 top-0 h-44 w-44 -rotate-[8deg]',
  'island-coco-refresher': 'left-6 bottom-2 h-40 w-40 rotate-[6deg]',
  'blue-hawaii-refresher': 'right-0 bottom-8 h-36 w-36 -rotate-[4deg]',
}

function DrinkAtmosphere({ answers }: { answers: QuizAnswers }) {
  const ranking = useMemo(() => getLiveRanking(answers), [answers])
  const hasAnswered = Object.keys(answers).length > 0
  const byId = new Map<DrinkId, LiveRankEntry>(ranking.map((entry) => [entry.drink.id, entry]))
  const featured = FEATURED_DRINK_IDS.map((id) => byId.get(id)!).filter(Boolean)
  const contenders = featured.filter((entry) => !entry.eliminated)
  const maxScore = Math.max(1, ...contenders.map((entry) => entry.score))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden h-80 w-80 shrink-0 lg:block xl:h-96 xl:w-96"
    >
      {featured.map((entry) => {
        const drink = drinks.find((d) => d.id === entry.drink.id)!
        if (!drink.image.cutout) return null
        const ratio = hasAnswered && !entry.eliminated ? entry.score / maxScore : 0.5
        const opacity = entry.eliminated ? 0.1 : hasAnswered ? 0.4 + ratio * 0.6 : 0.6
        const scale = entry.eliminated ? 0.92 : hasAnswered ? 0.94 + ratio * 0.08 : 1
        return (
          <div
            key={drink.id}
            className={`absolute transition-[opacity,scale] duration-slow ease-calm ${FEATURED_LAYOUT[drink.id]}`}
            style={{ opacity, scale }}
          >
            <Image src={drink.image.cutout} alt="" fill sizes="14rem" className="object-contain drop-shadow-xl" />
          </div>
        )
      })}
    </div>
  )
}

export function KonaQuiz() {
  const [stage, setStage] = useState<Stage>({ kind: 'invitation' })
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const beginRef = useRef<HTMLButtonElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const focusRequested = useRef(false)

  const goTo = useCallback((next: Stage) => {
    focusRequested.current = true
    setStage(next)
  }, [])

  useEffect(() => {
    if (!focusRequested.current) return
    focusRequested.current = false
    const target = stage.kind === 'invitation' ? beginRef.current : headingRef.current
    target?.focus()
  }, [stage])

  const recommendation = useMemo(
    () => (stage.kind === 'result' ? recommendDrinks(answers) : null),
    [stage.kind, answers]
  )

  const chooseAnswer = (questionId: string, optionId: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }))
  }

  const startAgain = () => {
    setAnswers({})
    goTo({ kind: 'invitation' })
  }

  if (stage.kind === 'result') {
    if (!recommendation) {
      return (
        <button
          ref={beginRef}
          type="button"
          onClick={startAgain}
          className="inline-flex min-h-14 items-center rounded-panel border border-sand-50/30 px-7 py-4 font-body text-sm text-sand-50"
        >
          {quizContent.result.startOverAction}
        </button>
      )
    }

    return (
      <KonaQuizResult
        recommendation={recommendation}
        headingRef={headingRef}
        onStartAgain={startAgain}
      />
    )
  }

  if (stage.kind === 'invitation') {
    return (
      <div className="discovery-enter flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="max-w-editorial font-body text-lede text-sand-100/80">
            {quizContent.supportingLine}
          </p>
          <button
            ref={beginRef}
            type="button"
            onClick={() => goTo({ kind: 'question', index: 0 })}
            className="mt-10 inline-flex min-h-16 items-center justify-center rounded-panel bg-sand-50 px-10 py-5 font-body text-base tracking-wide text-charcoal-900 shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-white hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 active:translate-y-px active:shadow-none"
          >
            {quizContent.startAction}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-3 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
          <p className="mt-5 font-body text-sm text-sand-100/55">{quizContent.trustLine}</p>
        </div>
        <DrinkAtmosphere answers={answers} />
      </div>
    )
  }

  const question = questions[stage.index]
  const selected = answers[question.id]
  const selectedOption = question.options.find((option) => option.id === selected)
  const hasAnswer = selected !== undefined
  const stepNumber = stage.index + 1
  const isLastStep = stepNumber === totalSteps
  const accent = selectedOption?.accent ?? 'var(--color-sand-50)'

  const goBack = () => {
    if (stage.index === 0) goTo({ kind: 'invitation' })
    else goTo({ kind: 'question', index: stage.index - 1 })
  }

  const goForward = () => {
    if (!isLastStep) {
      goTo({ kind: 'question', index: stage.index + 1 })
      return
    }
    if (isQuizComplete(answers)) goTo({ kind: 'result' })
  }

  return (
    <div className="relative">
      {/* Reactive atmosphere: a soft radial wash of the selected option's own
          accent, never a loud or rainbow gradient, transitioning gently
          between questions and answers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 transition-[background] duration-slow ease-calm sm:-inset-x-12"
        style={{
          background: `radial-gradient(ellipse at 15% 20%, color-mix(in srgb, ${accent} 16%, transparent) 0%, transparent 65%)`,
        }}
      />

      <div className="flex items-center gap-5">
        <p className="shrink-0 font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/70">
          {stepNumber} of {totalSteps}
        </p>
        <div aria-hidden="true" className="flex flex-1 items-center gap-1.5">
          {questions.map((step, index) => (
            <span
              key={step.id}
              className="h-1 flex-1 rounded-full transition-colors duration-500 ease-calm"
              style={{
                backgroundColor:
                  index < stage.index
                    ? 'var(--color-gold-400)'
                    : index === stage.index
                      ? accent
                      : 'color-mix(in srgb, var(--color-sand-50) 20%, transparent)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div key={question.id} className="discovery-enter min-w-0 flex-1">
          <fieldset className="min-w-0 border-0 p-0">
            <legend className="mb-7 p-0">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="max-w-editorial font-display text-display-sm font-light text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
              >
                {question.prompt}
              </h3>
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option) => {
                const isSelected = selected === option.id
                return (
                  <label
                    key={option.id}
                    className="group relative flex min-h-16 cursor-pointer items-center gap-4 rounded-panel border px-5 py-4 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-calm has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 active:translate-y-px sm:px-6"
                    style={{
                      borderColor: isSelected ? option.accent : 'color-mix(in srgb, var(--color-sand-50) 18%, transparent)',
                      backgroundColor: isSelected ? 'color-mix(in srgb, var(--color-sand-50) 10%, transparent)' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => chooseAnswer(question.id, option.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-subtle border transition-[background-color,border-color] duration-200 ease-calm"
                      style={{
                        borderColor: isSelected ? option.accent : 'color-mix(in srgb, var(--color-sand-50) 35%, transparent)',
                        backgroundColor: isSelected ? option.accent : 'transparent',
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 text-charcoal-900 transition-transform duration-200 ease-enter ${isSelected ? 'scale-100' : 'scale-0'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    </span>
                    <span className={`font-body text-lg leading-snug ${isSelected ? 'text-sand-50' : 'text-sand-100/75'}`}>
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Confirms the choice without delaying the next question — the
              Continue button sits right beside it, never an auto-advance. */}
          <div aria-live="polite" className="mt-5 min-h-6">
            {selectedOption && (
              <p key={selectedOption.id} className="discovery-enter font-body text-sm text-sand-100/75">
                {selectedOption.reaction}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-4">
            {hasAnswer ? (
              <button
                key="continue"
                type="button"
                onClick={goForward}
                className="discovery-enter inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-9 py-4 font-body text-sm tracking-wide text-charcoal-900 shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-white hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 active:translate-y-px active:shadow-none"
              >
                {isLastStep ? 'See your match' : 'Continue'}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-2.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-14 cursor-not-allowed items-center justify-center rounded-panel border border-dashed border-sand-50/25 px-9 py-4 font-body text-sm tracking-wide text-sand-100/50"
              >
                Choose one to continue
              </button>
            )}

            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/25 px-7 py-4 font-body text-sm text-sand-100/75 transition-colors duration-200 hover:border-sand-50/50 hover:text-sand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              {quizContent.result.backAction}
            </button>
          </div>
        </div>

        <DrinkAtmosphere answers={answers} />
      </div>
    </div>
  )
}
