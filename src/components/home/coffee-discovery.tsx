'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { discovery } from '@/content/discovery'
import type { QuestionId } from '@/content/types'
import {
  isComplete,
  recommend,
  type DiscoveryAnswers,
} from '@/lib/discovery/recommendation'
import { DiscoveryResult } from '@/components/home/discovery-result'

/**
 * Find Your Kona — the guided interaction.
 *
 * A short consultation, not a quiz: three questions, then two independent
 * recommendations. All of it is local and synchronous — no request, no
 * persistence, no URL state, no history manipulation, so the browser's back
 * button continues to mean "leave this page", and nothing here traps scroll.
 *
 * Structure:
 * - Each question is a real radio group in a fieldset. The legend carries the
 *   question, so assistive technology announces it with every option, and
 *   arrow-key navigation between options comes from the platform rather than
 *   from a key handler.
 * - Step changes move focus to the new heading. That is the announcement:
 *   a live region in addition would say the same thing twice.
 * - Choosing an answer does not advance on its own. A visitor is meant to be
 *   able to change their mind, and an automatic jump takes that away; instead
 *   Continue is revealed the moment a choice exists, which is what makes the
 *   next step obvious.
 * - Movement is CSS only, keyed off the stage, and is neutralised under
 *   prefers-reduced-motion by the global rules in globals.css.
 */

type Stage =
  | { kind: 'invitation' }
  | { kind: 'question'; index: number }
  | { kind: 'result' }

const questions = discovery.questions
const totalSteps = questions.length

export function CoffeeDiscovery() {
  const [stage, setStage] = useState<Stage>({ kind: 'invitation' })
  const [answers, setAnswers] = useState<DiscoveryAnswers>({})

  const beginRef = useRef<HTMLButtonElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  // Focus is only moved in response to a deliberate step change, never on
  // mount and never when the visitor is simply changing an answer.
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
    () => (stage.kind === 'result' ? recommend(answers) : null),
    [stage.kind, answers]
  )

  const chooseAnswer = (questionId: QuestionId, optionId: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }))
  }

  const startAgain = () => {
    setAnswers({})
    goTo({ kind: 'invitation' })
  }

  /* ---------------------------------------------------------------- */

  if (stage.kind === 'invitation') {
    return (
      <div data-discovery-interactive className="discovery-enter">
        <p className="max-w-editorial font-body text-lede text-ink-soft">
          {discovery.intro}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          {/* The halo is a slow breath of light behind the button, not a
              flash. It sits under the button, is inert to the pointer, and is
              switched off entirely under reduced motion. */}
          <span className="relative inline-flex">
            <span
              aria-hidden="true"
              className="begin-halo pointer-events-none absolute -inset-1 rounded-panel bg-accent-soft/55 blur-lg"
            />
            <button
              ref={beginRef}
              type="button"
              onClick={() => goTo({ kind: 'question', index: 0 })}
              className="relative inline-flex min-h-16 items-center justify-center rounded-panel bg-surface-inverse px-10 py-5 font-body text-base tracking-wide text-ink-inverse shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-espresso-700 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:translate-y-px active:shadow-none"
            >
              {discovery.beginLabel}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="ml-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h15" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </span>

          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft">
            {discovery.invitationMeta}
          </p>
        </div>
      </div>
    )
  }

  if (stage.kind === 'result') {
    // `recommend` returns null for an incomplete set; the result stage is only
    // reachable from a complete one, but the guard keeps the invariant local.
    if (!recommendation) {
      return (
        <div data-discovery-interactive>
          <button
            ref={beginRef}
            type="button"
            onClick={startAgain}
            className="inline-flex min-h-14 items-center rounded-panel border border-line-strong px-7 py-4 font-body text-sm text-ink"
          >
            {discovery.result.startAgainLabel}
          </button>
        </div>
      )
    }

    return (
      <div data-discovery-interactive>
        <DiscoveryResult
          recommendation={recommendation}
          headingRef={headingRef}
          onStartAgain={startAgain}
        />
      </div>
    )
  }

  /* ---------------------------------------------------------------- */

  const question = questions[stage.index]
  const selected = answers[question.id]
  const hasAnswer = selected !== undefined
  const stepNumber = stage.index + 1
  const isLastStep = stepNumber === totalSteps

  const goBack = () => {
    if (stage.index === 0) goTo({ kind: 'invitation' })
    else goTo({ kind: 'question', index: stage.index - 1 })
  }

  const goForward = () => {
    if (!isLastStep) {
      goTo({ kind: 'question', index: stage.index + 1 })
      return
    }
    if (isComplete(answers)) goTo({ kind: 'result' })
  }

  return (
    <div data-discovery-interactive>
      {/* Progress. The bar is decorative; the count carries the same
          information in text so nothing depends on colour. */}
      <div className="flex items-center gap-5">
        <p className="shrink-0 font-body text-eyebrow uppercase tracking-[0.18em] text-ink">
          Step {stepNumber} of {totalSteps}
        </p>
        <div aria-hidden="true" className="flex flex-1 items-center gap-1.5">
          {questions.map((step, index) => (
            <span
              key={step.id}
              className={`h-0.5 flex-1 transition-colors duration-500 ease-calm ${
                index <= stage.index ? 'bg-accent' : 'bg-line-strong'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Re-keyed per step so the enter transition replays as the question
          changes. */}
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
                  className={`group relative flex min-h-20 cursor-pointer items-start gap-4 rounded-panel border px-5 py-5 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-calm has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent active:translate-y-px sm:px-6 ${
                    isSelected
                      ? 'border-accent bg-surface-raised shadow-lift'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-surface-raised hover:shadow-lift'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => chooseAnswer(question.id, option.id)}
                    className="sr-only"
                  />
                  {/* Shape as well as colour: an empty square becomes a filled
                      square carrying a checkmark, so the selected option reads
                      without colour vision. The mark scales in rather than
                      appearing, which is the motion cue. */}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-subtle border transition-[background-color,border-color] duration-200 ease-calm ${
                      isSelected
                        ? 'border-accent bg-accent'
                        : 'border-line-strong bg-transparent group-hover:border-ink-muted'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 text-sand-50 transition-transform duration-200 ease-enter ${
                        isSelected ? 'scale-100' : 'scale-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block font-body text-lg leading-snug transition-colors duration-200 ${
                        isSelected ? 'text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.detail && (
                      <span className="mt-1.5 block font-body text-sm leading-relaxed text-ink-muted">
                        {option.detail}
                      </span>
                    )}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-4">
          {hasAnswer ? (
            // Keyed so the reveal plays once, when an answer first exists —
            // not again each time the visitor changes their mind.
            <button
              key="continue"
              type="button"
              onClick={goForward}
              className="discovery-enter inline-flex min-h-14 items-center justify-center rounded-panel bg-surface-inverse px-9 py-4 font-body text-sm tracking-wide text-ink-inverse shadow-lift transition-[background-color,transform,box-shadow] duration-200 ease-calm hover:bg-espresso-700 hover:shadow-panel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:translate-y-px active:shadow-none"
            >
              {isLastStep ? 'See your match' : 'Continue'}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="ml-2.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h15" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            // Disabled rather than absent, so the control does not appear from
            // nowhere and shift the layout when a choice is made.
            <button
              type="button"
              disabled
              className="inline-flex min-h-14 cursor-not-allowed items-center justify-center rounded-panel border border-dashed border-line-strong px-9 py-4 font-body text-sm tracking-wide text-ink-soft"
            >
              {discovery.choosePrompt}
            </button>
          )}

          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-14 items-center justify-center rounded-panel border border-line-strong px-7 py-4 font-body text-sm text-ink-soft transition-colors duration-200 hover:border-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Back
          </button>
        </div>
      </div>

      {/* Ordering and the menu stay one click away throughout, so the
          consultation never sits between a visitor and what they came for. */}
      <p className="mt-8 font-body text-sm text-ink-soft">
        Or go straight to the{' '}
        <Link
          href={discovery.result.viewMenu.href}
          className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent hover:text-ink"
        >
          menu
        </Link>
        .
      </p>
    </div>
  )
}
