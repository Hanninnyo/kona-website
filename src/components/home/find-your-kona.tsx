import dynamic from 'next/dynamic'
import { quizContent } from '@/content/kona-quiz'

// Code-split from the homepage's initial JS: the quiz's interaction and
// scoring logic loads as its own chunk, fetched alongside rather than bundled
// into the shared homepage bundle every visitor downloads regardless of
// whether they ever open the quiz. `ssr: true` (the default) is kept, so the
// server-rendered HTML — and the no-JS `<noscript>` fallback below it — are
// unaffected; only the JS delivery is split.
const KonaQuiz = dynamic(() =>
  import('@/components/home/kona-quiz').then((m) => m.KonaQuiz)
)

/**
 * Find Your Kona — the five-question drink quiz, section shell.
 *
 * A Server Component: the eyebrow and heading are in the initial HTML.
 * Without JavaScript the guided interaction cannot run, so the `<noscript>`
 * block hides it and leaves a plain link to the menu — a real destination,
 * not an inert control — exactly the convention the site's other
 * JavaScript-dependent interaction already uses.
 *
 * This replaces the three-question bean-and-drink consultation that used to
 * live here (`coffee-discovery.tsx`, `discovery.ts`) with a drink-only
 * five-question quiz. That module is untouched and still fully verified; it
 * is simply no longer mounted on the homepage.
 */
export function FindYourKona() {
  return (
    <section
      id="find-your-kona"
      aria-labelledby="quiz-heading"
      className="scroll-mt-24 bg-surface-sunken py-24 sm:py-32"
    >
      <noscript>
        <style>{'[data-quiz-interactive]{display:none !important}'}</style>
      </noscript>

      <div className="mx-auto max-w-page px-5 sm:px-8">
        <div className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-accent">
            {quizContent.eyebrow}
          </p>
          <h2
            id="quiz-heading"
            className="mt-5 font-display text-display-md font-light text-ink"
          >
            {quizContent.heading}
          </h2>
        </div>

        <div data-quiz-interactive className="mt-8">
          <KonaQuiz />
        </div>

        <noscript>
          <p className="mt-8 max-w-editorial font-body text-lede text-ink-soft">
            {quizContent.supportingLine}{' '}
            <a
              href="/menu-preview"
              className="underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            >
              View the menu
            </a>
            .
          </p>
        </noscript>
      </div>
    </section>
  )
}
