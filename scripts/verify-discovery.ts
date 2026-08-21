/**
 * Find Your Kona — deterministic verification of the recommendation engine.
 *
 * The repository has no test runner and the Phase 2 brief forbids installing
 * one, so this is a self-checking diagnostic script rather than a test suite.
 * It runs the representative scenarios from the brief, plus determinism and
 * coverage checks, and exits non-zero on any failure.
 *
 * Run with:
 *   node --experimental-strip-types --import ./scripts/register-alias.mjs \
 *        scripts/verify-discovery.ts
 */
import { discovery } from '@/content/discovery'
import {
  recommend,
  resolveSelections,
  type DiscoveryAnswers,
} from '@/lib/discovery/recommendation'

interface Scenario {
  name: string
  answers: DiscoveryAnswers
  expectBean: string
  expectDrink?: string
  expectDecafRequested?: boolean
}

const scenarios: Scenario[] = [
  {
    name: '1 — Comforting + Chocolate & caramel + Pour-over',
    answers: { mood: 'comforting', flavor: 'chocolate-caramel', method: 'pour-over' },
    expectBean: 'private-estate',
  },
  {
    name: '2 — Bright + Bright & fruity + Iced',
    answers: { mood: 'bright', flavor: 'bright-fruity', method: 'iced' },
    expectBean: 'peaberry',
    expectDrink: 'island-coco-refresher',
  },
  {
    name: '3 — Tropical + Flavored coffee + Espresso and milk',
    answers: { mood: 'tropical', flavor: 'flavored', method: 'espresso-milk' },
    expectBean: 'chocolate-macadamia',
    expectDrink: 'kona-island-latte',
  },
  {
    name: '4 — Indulgent + Toasted & nutty + Espresso and milk',
    answers: { mood: 'indulgent', flavor: 'toasted-nutty', method: 'espresso-milk' },
    expectBean: 'hazelnut',
    expectDrink: 'nutella',
  },
  {
    // The bean is constrained to the decaf coffee; the drink is scored normally
    // on mood and flavour and is offered with decaf espresso.
    name: '5 — Comforting + Smooth & balanced + Decaf',
    answers: { mood: 'comforting', flavor: 'smooth-balanced', method: 'decaf' },
    expectBean: 'kauai-decaf',
    expectDrink: 'captain-cook',
    expectDecafRequested: true,
  },
]

let failures = 0

function fail(message: string) {
  failures += 1
  console.error(`   FAIL  ${message}`)
}

console.log('\nFind Your Kona — representative scenarios\n')

for (const scenario of scenarios) {
  const result = recommend(scenario.answers)
  if (!result) {
    fail(`${scenario.name}: no recommendation returned`)
    continue
  }

  const { bean, drink } = result
  console.log(`${scenario.name}`)
  console.log(
    `   bean   ${bean.item.name} (${bean.score}) — ${bean.matchedTags.join(', ')}`
  )
  console.log(
    `   drink  ${drink.item.name} (${drink.score}) — ${drink.matchedTags.join(', ')}`
  )

  if (bean.item.id !== scenario.expectBean) {
    fail(`expected bean ${scenario.expectBean}, got ${bean.item.id}`)
  }
  if (scenario.expectDrink && drink.item.id !== scenario.expectDrink) {
    fail(`expected drink ${scenario.expectDrink}, got ${drink.item.id}`)
  }
  if (
    scenario.expectDecafRequested !== undefined &&
    result.decafRequested !== scenario.expectDecafRequested
  ) {
    fail(
      `expected decafRequested=${scenario.expectDecafRequested}, got ${result.decafRequested}`
    )
  }
  if (result.decafRequested) {
    console.log(
      `   decaf   bean: ${bean.item.availability ?? '(none)'} — drink: ${
        drink.item.espressoBased ? discovery.result.decafDrinkAvailability : '(not espresso-based)'
      }`
    )
  }
  console.log('')
}

/* ---------------------------------------------------------------------- */

console.log('Exhaustive sweep of every answer combination\n')

const [mood, flavor, method] = discovery.questions
const beanCounts = new Map<string, number>()
const drinkCounts = new Map<string, number>()
let combinations = 0

for (const m of mood.options) {
  for (const f of flavor.options) {
    for (const h of method.options) {
      const answers: DiscoveryAnswers = { mood: m.id, flavor: f.id, method: h.id }
      const result = recommend(answers)
      combinations += 1

      if (!result) {
        fail(`no recommendation for ${m.id} / ${f.id} / ${h.id}`)
        continue
      }

      // Determinism: the same answers must produce the same pair every time.
      const repeat = recommend(answers)
      if (
        repeat?.bean.item.id !== result.bean.item.id ||
        repeat?.drink.item.id !== result.drink.item.id
      ) {
        fail(`non-deterministic result for ${m.id} / ${f.id} / ${h.id}`)
      }

      // Decaf must never return a caffeinated bean...
      if (h.id === 'decaf' && result.bean.item.id !== 'kauai-decaf') {
        fail(`decaf returned ${result.bean.item.id} for ${m.id} / ${f.id}`)
      }
      // ...must narrow the bean pool rather than merely outscore...
      if (h.id === 'decaf' && !result.beanWasConstrained) {
        fail(`decaf did not constrain the bean pool for ${m.id} / ${f.id}`)
      }
      // ...must be recognised as a decaf request...
      if (h.id === 'decaf' && !result.decafRequested) {
        fail(`decaf was not flagged as requested for ${m.id} / ${f.id}`)
      }
      // ...and the drink it recommends must be one that can be made with decaf
      // espresso, so the availability line always applies.
      if (h.id === 'decaf' && !result.drink.item.espressoBased) {
        fail(
          `decaf recommended a non-espresso drink (${result.drink.item.id}) for ${m.id} / ${f.id}`
        )
      }
      // No other answer may claim decaf availability.
      if (h.id !== 'decaf' && result.decafRequested) {
        fail(`decafRequested set for a non-decaf answer: ${m.id} / ${f.id} / ${h.id}`)
      }
      // Every combination must resolve three selections.
      if (resolveSelections(answers).length !== 3) {
        fail(`selections did not resolve for ${m.id} / ${f.id} / ${h.id}`)
      }

      beanCounts.set(
        result.bean.item.id,
        (beanCounts.get(result.bean.item.id) ?? 0) + 1
      )
      drinkCounts.set(
        result.drink.item.id,
        (drinkCounts.get(result.drink.item.id) ?? 0) + 1
      )
    }
  }
}

console.log(`   ${combinations} combinations evaluated`)
console.log('   beans reachable:')
for (const bean of discovery.beans) {
  const count = beanCounts.get(bean.id) ?? 0
  console.log(`     ${String(count).padStart(3)}  ${bean.name}`)
  if (count === 0) fail(`${bean.name} is unreachable`)
}
console.log('   drinks reachable:')
for (const drink of discovery.drinks) {
  const count = drinkCounts.get(drink.id) ?? 0
  console.log(`     ${String(count).padStart(3)}  ${drink.name}`)
  if (count === 0) fail(`${drink.name} is unreachable`)
}

/* ---------------------------------------------------------------------- */

console.log('\nContent safety\n')

// Everything the section can render, as one searchable string.
const allCopy = JSON.stringify(discovery)

const banned: { pattern: RegExp; why: string }[] = [
  { pattern: /\/coffee/, why: 'links to the unapproved legacy /coffee route' },
  { pattern: /order first/i, why: 'unverified customer-behaviour claim' },
  { pattern: /come back for/i, why: 'unverified repeat-customer claim' },
  { pattern: /guests order/i, why: 'unverified customer-behaviour claim' },
  { pattern: /flavor match rather than/i, why: 'removed decaf disclaimer' },
  // Narrow on purpose: "Rich and balanced without caffeine" is the verified
  // personality of the Kauaʻi bean and must stay.
  { pattern: /available without caffeine/i, why: 'removed decaf uncertainty wording' },
  { pattern: /ask our team/i, why: 'removed decaf uncertainty wording' },
]

for (const { pattern, why } of banned) {
  if (pattern.test(allCopy)) fail(`content still contains ${pattern} — ${why}`)
  else console.log(`   absent: ${pattern.source}  (${why})`)
}

// Positive assertions about the confirmed decaf facts.
const kauai = discovery.beans.find((bean) => bean.id === 'kauai-decaf')
if (kauai?.availability !== 'Available as a decaf pour-over.') {
  fail('Kauaʻi Decaf is missing its confirmed pour-over availability')
} else console.log(`   bean line: "${kauai.availability}"`)

if (!kauai?.clarification?.includes('100% Hawaiian coffee')) {
  fail('the Kauaʻi Decaf / Kona distinction is missing')
} else console.log('   Kauaʻi Decaf is still distinguished from Kona coffee')

console.log(`   drink line: "${discovery.result.decafDrinkAvailability}"`)
for (const drink of discovery.drinks) {
  if (!drink.espressoBased) {
    console.log(`   note: ${drink.name} is not espresso-based`)
  }
}

console.log('\nIncomplete answers\n')
for (const partial of [
  {},
  { mood: 'comforting' },
  { mood: 'comforting', flavor: 'smooth-balanced' },
  { mood: 'not-a-real-option', flavor: 'smooth-balanced', method: 'iced' },
] satisfies DiscoveryAnswers[]) {
  const result = recommend(partial)
  const label = JSON.stringify(partial)
  if (result !== null) fail(`expected null for ${label}`)
  else console.log(`   null for ${label}`)
}

console.log('')
if (failures > 0) {
  console.error(`${failures} check(s) failed\n`)
  process.exit(1)
}
console.log('All checks passed\n')
