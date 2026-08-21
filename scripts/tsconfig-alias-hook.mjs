/**
 * Minimal module resolution hook so the discovery engine can be executed
 * directly by Node, outside Next.js.
 *
 * The repository has no test runner, and the Phase 2 brief is explicit that
 * one must not be installed for this work. Node 22 can execute TypeScript
 * directly with --experimental-strip-types; the only thing it cannot do is
 * resolve the project's `@/*` path alias, which is what this adds. Nothing
 * here is imported by the application.
 */
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const base = path.join(projectRoot, 'src', specifier.slice(2))
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (existsSync(candidate)) {
        return { url: pathToFileURL(candidate).href, shortCircuit: true }
      }
    }
  }
  return nextResolve(specifier, context)
}
