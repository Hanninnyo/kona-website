import Image from 'next/image'
import type { ImageSlot } from '@/content/types'

const ASPECT: Record<ImageSlot['aspect'], string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
}

interface MediaFrameProps {
  slot: ImageSlot
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Renders an image slot, or an honest placeholder when approved photography is
 * still outstanding.
 *
 * The placeholder is deliberately plain: it states what is missing rather than
 * standing in with unrelated or pre-opening imagery. Dropping a real file into
 * `public/` and setting `src` on the slot replaces it with no layout change.
 */
export function MediaFrame({ slot, className = '', sizes, priority }: MediaFrameProps) {
  const shape = ASPECT[slot.aspect]

  if (!slot.src) {
    return (
      <div
        className={`${shape} ${className} relative flex items-end overflow-hidden rounded-frame border border-dashed border-line-strong bg-surface-sunken`}
        // Decorative stand-in, not content. Screen readers skip it; the brief
        // below is for the owner and is intentionally not announced as an image.
        role="presentation"
      >
        <div className="p-5 sm:p-7">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-ink-muted">
            Photography pending
          </p>
          <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-ink-soft">
            {slot.awaiting}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${shape} ${className} relative overflow-hidden rounded-frame bg-surface-sunken`}>
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        priority={priority}
        sizes={sizes ?? '100vw'}
        className="object-cover"
      />
    </div>
  )
}
