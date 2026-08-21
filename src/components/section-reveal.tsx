'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SectionRevealProps {
  children: React.ReactNode
  className?: string
  /** Stagger within a group, in milliseconds. */
  delayMs?: number
  as?: 'div' | 'li' | 'section'
}

/**
 * Reveals its children as they scroll into view.
 *
 * Deliberately CSS-driven rather than JS-animated:
 * - Server output carries no reveal state, so content is visible without
 *   JavaScript and before hydration. Nothing is hidden behind an animation.
 * - Only elements below the fold at mount are ever hidden, so nothing above
 *   the fold flashes.
 * - Under prefers-reduced-motion the observer is never installed and the CSS
 *   neutralises the reveal, so content simply appears.
 */
export function SectionReveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
}: SectionRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Reduced motion resolves after hydration, so a reveal may already have
    // been staged. Clear it rather than relying on the CSS override alone —
    // content must never depend on an animation to become visible.
    if (prefersReducedMotion) {
      delete element.dataset.reveal
      element.style.transitionDelay = ''
      return
    }

    // Already visible: leave it alone rather than animate it in late.
    const belowFold =
      element.getBoundingClientRect().top > window.innerHeight * 0.9
    if (!belowFold) return

    element.dataset.reveal = 'pending'
    element.style.transitionDelay = `${delayMs}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          element.dataset.reveal = 'in'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delayMs, prefersReducedMotion])

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  )
}
