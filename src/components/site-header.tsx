'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OrderChooser } from '@/components/order-chooser'
import { site } from '@/content/site'

/**
 * Global site header.
 *
 * Transparent over the hero on the homepage, and a readable solid surface once
 * scrolled or on any other route.
 *
 * The mobile menu applies, precisely: role="dialog" with aria-modal, a Tab
 * focus trap scoped to the panel, Escape to close, focus return to the trigger,
 * and a body scroll lock. It does NOT mark background content inert or
 * aria-hidden, so assistive technology can still reach the page behind it via
 * virtual cursor. Adding that is a follow-up, not part of this correction.
 *
 * Ordering is one action, not two. Kona takes orders in two places, so the
 * header's single Order Ahead control opens a small choice panel rather than
 * sending every visitor to the café; the mobile menu lists both destinations
 * outright, where there is room and no need for a second layer.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // Only the homepage has a full-bleed hero to sit over.
  const overHero = pathname === '/'
  const solid = scrolled || !overHero || menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Escape to close, and a focus trap while the panel is open.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [menuOpen, closeMenu])

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!menuOpen) return
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [menuOpen])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-calm',
        solid
          ? 'border-b border-line bg-surface/95 text-ink backdrop-blur-sm'
          // Over the hero the ground is a dark photograph, so the header
          // inverts to keep every control above AA contrast.
          : 'border-b border-transparent bg-transparent text-sand-50',
      ].join(' ')}
    >
      <div className="mx-auto flex h-20 max-w-page items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${site.brand.name} — home`}
        >
          <Image
            src={site.brand.logoMark.src}
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11"
          />
          {/*
            No approved horizontal wordmark exists, so the brand name is set in
            the display face beside the mark rather than approximated as a logo.
            When a wordmark is delivered it replaces this span directly.
          */}
          <span className="hidden font-display text-lg leading-tight tracking-wide sm:block">
            Kona Island Coffee
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.navigation.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'font-body text-sm transition-colors duration-200',
                      solid
                        ? active
                          ? 'text-accent'
                          : 'text-ink-soft hover:text-ink'
                        : active
                          ? 'text-gold-400'
                          : 'text-sand-100/85 hover:text-sand-50',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <OrderChooser solid={solid} className="hidden sm:block" />

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-panel text-current lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? 'Close menu' : 'Open menu'}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <path d="M5 5l14 14" />
                  <path d="M19 5L5 19" />
                </>
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 16h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="border-t border-line bg-surface lg:hidden"
        >
          <nav aria-label="Primary (mobile)" className="mx-auto max-w-page px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {site.navigation.map((item) => (
                <li key={item.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className="block py-4 font-display text-2xl text-ink"
                  >
                    {item.label}
                    {item.description && (
                      <span className="mt-0.5 block font-body text-sm text-ink-muted">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* No nested disclosure here: on a panel this size both
                destinations fit, and one fewer layer to open is one fewer
                thing between a visitor and a coffee. */}
            <div className="mt-6 mb-2">
              <p
                id={`${menuId}-order`}
                className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-soft"
              >
                Order ahead from
              </p>
              <ul aria-labelledby={`${menuId}-order`} className="mt-3 flex flex-col gap-3">
                {site.orderDestinations.map((destination, index) => (
                  <li key={destination.href}>
                    <a
                      href={destination.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className={[
                        'block min-h-14 rounded-panel px-5 py-4 font-body text-sm',
                        index === 0
                          ? 'bg-surface-inverse text-ink-inverse'
                          : 'border border-ink-soft text-ink',
                      ].join(' ')}
                    >
                      {destination.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                      {destination.description && (
                        <span
                          className={[
                            'mt-0.5 block font-body text-sm',
                            index === 0 ? 'text-ink-inverse-soft' : 'text-ink-muted',
                          ].join(' ')}
                        >
                          {destination.description}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
