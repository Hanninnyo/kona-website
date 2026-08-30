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
 * Dark, color-responsive ground (`bg-espresso-900`), matching the rest of the
 * product-led homepage — the quiz itself layers a reactive atmosphere and a
 * live drink-cutout visual on top of it (see `kona-quiz.tsx`).
 */
export function FindYourKona() {
  return (
    <section
      id="find-your-kona"
      aria-labelledby="quiz-heading"
      className="scroll-mt-24 bg-espresso-900 py-24 sm:py-32"
    >
      <noscript>
        <style>{'[data-quiz-interactive]{display:none !important}'}</style>
      </noscript>

      <div className="mx-auto max-w-page px-5 sm:px-8">
        <div className="max-w-editorial">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
            {quizContent.eyebrow}
          </p>
          <h2
            id="quiz-heading"
            className="mt-5 font-display text-display-md font-light text-sand-50"
          >
            Your Next Favorite Drink
            <br />
            Is Five Taps Away.
          </h2>
        </div>

        <div data-quiz-interactive className="mt-8">
          <KonaQuiz />
        </div>

        <noscript>
          <p className="mt-8 max-w-editorial font-body text-lede text-sand-100/80">
            {quizContent.supportingLine}{' '}
            <a
              href="/menu-preview"
              className="underline decoration-sand-100/40 underline-offset-4 hover:decoration-gold-400"
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
