'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { site } from '@/content/site'

/**
 * The header's single ordering action.
 *
 * Kona takes orders in two places, and the header must not become two competing
 * buttons. One restrained action opens a small panel offering both — the café
 * and the truck — with equal weight.
 *
 * Implemented as a disclosure, not an ARIA menu. The panel holds two ordinary
 * links, so Tab reaches them in document order and no arrow-key handler is
 * needed; adding `role="menu"` would promise keyboard behaviour that plain
 * links do not have. What it does implement:
 * - `aria-expanded` and `aria-controls` on the trigger;
 * - Escape closes and returns focus to the trigger;
 * - a pointer press outside closes it;
 * - moving focus out of the panel closes it, so tabbing past does the
 *   expected thing.
 *
 * This is not a modal: it does not lock scroll, trap focus, or mark anything
 * behind it inert, and it does not claim to.
 */

interface OrderChooserProps {
  /** True once the header sits on a solid surface rather than over the hero. */
  solid: boolean
  className?: string
}

export function OrderChooser({ solid, className = '' }: OrderChooserProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      close(true)
    }

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (root && !root.contains(event.target as Node)) close(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, close])

  // Tabbing out of the panel closes it. relatedTarget is the element receiving
  // focus; null means focus left the document, which is not a reason to close.
  const onBlurCapture = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget
    if (next === null) return
    if (!rootRef.current?.contains(next)) setOpen(false)
  }

  return (
    <div ref={rootRef} onBlurCapture={onBlurCapture} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        className={[
          'inline-flex min-h-11 items-center gap-2 rounded-panel border px-5 py-2.5 font-body text-sm transition-colors duration-200',
          solid
            ? 'border-ink/25 text-ink hover:border-accent hover:text-accent'
            : 'border-sand-50/45 text-sand-50 hover:border-sand-50 hover:bg-sand-50/10',
        ].join(' ')}
      >
        {site.primaryAction.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 transition-transform duration-200 ease-calm ${
            open ? '-rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          className="discovery-enter absolute right-0 top-full z-10 mt-2 w-72 rounded-frame border border-line bg-surface-raised p-2 shadow-panel"
        >
          <p
            id={`${panelId}-label`}
            className="px-3 pb-2 pt-2 font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft"
          >
            Order from
          </p>
          <ul aria-labelledby={`${panelId}-label`}>
            {site.orderDestinations.map((destination) => (
              <li key={destination.href}>
                <a
                  href={destination.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block rounded-panel px-3 py-3 transition-colors duration-150 hover:bg-sand-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  <span className="block font-body text-base text-ink">
                    {destination.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  {destination.description && (
                    <span className="mt-0.5 block font-body text-sm text-ink-muted">
                      {destination.description}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
