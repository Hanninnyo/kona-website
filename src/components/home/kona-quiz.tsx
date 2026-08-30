'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { quizContent } from '@/content/kona-quiz'
import { isQuizComplete, recommendDrinks, type QuizAnswers } from '@/lib/kona-quiz/recommend'
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

/** Rotates through the quiz's own accent palette, one per question step. */
const STEP_ACCENTS = [
  'var(--color-quiz-coral)',
  'var(--color-quiz-turquoise)',
  'var(--color-quiz-mango)',
  'var(--color-quiz-ube)',
  'var(--color-quiz-coconut)',
]

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

  if (stage.kind === 'invitation') {
    return (
      <div className="discovery-enter">
        <p className="max-w-editorial font-body text-lede text-ink-soft">
          {quizContent.supportingLine}
        </p>
        <button
          ref={beginRef}
          type="button"
          onClick={() => goTo({ kind: 'question', index: 0 })}
          className="mt-10 inline-flex min-h-16 items-center justify-center rounded-panel bg-surface-inverse px-10 py-5 font-body text-base tracking-wide text-ink-inverse shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-espresso-700 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:translate-y-px active:shadow-none"
        >
          Begin
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-3 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h15" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    )
  }

  if (stage.kind === 'result') {
    if (!recommendation) {
      return (
        <button
          ref={beginRef}
          type="button"
          onClick={startAgain}
          className="inline-flex min-h-14 items-center rounded-panel border border-line-strong px-7 py-4 font-body text-sm text-ink"
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

  const question = questions[stage.index]
  const selected = answers[question.id]
  const hasAnswer = selected !== undefined
  const stepNumber = stage.index + 1
  const isLastStep = stepNumber === totalSteps
  const accent = STEP_ACCENTS[stage.index % STEP_ACCENTS.length]

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
    <div>
      <div className="flex items-center gap-5">
        <p className="shrink-0 font-body text-eyebrow uppercase tracking-[0.18em] text-ink">
          Step {stepNumber} of {totalSteps}
        </p>
        <div aria-hidden="true" className="flex flex-1 items-center gap-1.5">
          {questions.map((step, index) => (
            <span
              key={step.id}
              className="h-1 flex-1 rounded-full transition-colors duration-500 ease-calm"
              style={{
                backgroundColor: index <= stage.index ? STEP_ACCENTS[index % STEP_ACCENTS.length] : 'var(--color-line-strong)',
              }}
            />
          ))}
        </div>
      </div>

      <div key={question.id} className="discovery-enter mt-8">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="mb-7 p-0">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="max-w-editorial font-display text-display-sm font-light text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
                    borderColor: isSelected ? accent : 'var(--color-line)',
                    backgroundColor: isSelected ? 'var(--color-surface-raised)' : 'var(--color-surface)',
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
                      borderColor: isSelected ? accent : 'var(--color-line-strong)',
                      backgroundColor: isSelected ? accent : 'transparent',
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 text-sand-50 transition-transform duration-200 ease-enter ${isSelected ? 'scale-100' : 'scale-0'}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </span>
                  <span className={`font-body text-lg leading-snug ${isSelected ? 'text-ink' : 'text-ink-soft'}`}>
                    {option.label}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-4">
          {hasAnswer ? (
            <button
              key="continue"
              type="button"
              onClick={goForward}
              className="discovery-enter inline-flex min-h-14 items-center justify-center rounded-panel bg-surface-inverse px-9 py-4 font-body text-sm tracking-wide text-ink-inverse shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-espresso-700 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:translate-y-px active:shadow-none"
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
              className="inline-flex min-h-14 cursor-not-allowed items-center justify-center rounded-panel border border-dashed border-line-strong px-9 py-4 font-body text-sm tracking-wide text-ink-soft"
            >
              Choose one to continue
            </button>
          )}

          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-14 items-center justify-center rounded-panel border border-line-strong px-7 py-4 font-body text-sm text-ink-soft transition-colors duration-200 hover:border-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {quizContent.result.backAction}
          </button>
        </div>
      </div>
    </div>
  )
}
