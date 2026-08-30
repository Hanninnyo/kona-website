import Link from 'next/link'
import Image from 'next/image'

/**
 * The Story Behind Every Cup — closing invitation into the satellite journey.
 *
 * One authentic farm photograph, no video, no heavy media. The journey
 * itself lives at `/our-kona-journey`; this is a short concise invitation
 * into it, not a retelling.
 */
export function OriginInvitation() {
  return (
    <section
      aria-labelledby="origin-heading"
      className="relative flex min-h-[60svh] items-center overflow-hidden bg-charcoal-900"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/kona-premium-farm.jpg"
          alt="A hand reaching into rows of Kona coffee plants on Hawaiʻi Island."
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/50 to-charcoal-900/30"
        />
      </div>

      <div className="relative mx-auto w-full max-w-page px-5 py-20 text-center sm:px-8">
        <h2
          id="origin-heading"
          className="mx-auto max-w-xl font-display text-display-md font-light text-sand-50"
        >
          The Story Behind Every Cup
        </h2>
        <p className="mx-auto mt-6 max-w-md font-body text-lede text-sand-100/85">
          Grown and roasted on Hawaiʻi Island.
          <br />
          Flown across the Pacific.
          <br />
          Served in the Bay Area.
        </p>
        <div className="mt-9">
          <Link
            href="/our-kona-journey"
            className="inline-flex items-center gap-2 rounded-panel border border-sand-50/45 px-7 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
          >
            Discover Our Kona Journey
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
