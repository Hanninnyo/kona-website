"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/* Hours are read from the verified location records rather than written here,
   so there is exactly one place in the codebase a time can be wrong. */
const cafeHours = site.locations.find((l) => l.id === "mountain-view")!.hours;
const truckSchedule = site.locations.find((l) => l.id === "coffee-truck")!.schedule!;

export default function Locations() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Page title */}
      <h1 className="text-4xl font-bold text-kona-taupe mb-8">
        Locations &amp; Hours
      </h1>

      {/* Location cards */}
      <div className="space-y-6">

        {/* ── Mountain View Storefront (flagship — listed first) ── */}
        <section className="rounded-2xl ring-1 ring-kona-teal/60 bg-black/10 p-6 shadow-kona-soft">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-semibold text-kona-taupe">
              Mountain View Storefront
            </h2>
            <span className="text-xs font-bold uppercase tracking-wide bg-kona-teal text-white px-2 py-0.5 rounded-full shrink-0">
              Now Open
            </span>
          </div>
          <p className="text-sm text-kona-white/85 mt-1">
            2565 California Street STE 84, Mountain View, CA 94040
          </p>
          <p className="text-sm text-kona-white/60 mt-0.5">
            San Antonio Village Center
          </p>
          <div className="mt-3 text-sm text-kona-white/80 space-y-0.5">
            {cafeHours.value.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=2565+California+Street+STE+84+Mountain+View+CA+94040"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-kona-teal px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kona-teal/90 transition-colors"
            >
              Get Directions →
            </a>
            <a
              href="https://kona-island-coffee-102495.square.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-kona-teal/50 px-5 py-2 text-sm font-semibold text-kona-teal hover:bg-kona-teal/10 transition-colors"
            >
              Order Storefront Online →
            </a>
          </div>
        </section>

        {/* ── Valley Medical Center — Coffee Truck ── */}
        <section className="rounded-2xl ring-1 ring-neutral-700/60 bg-black/10 p-6 shadow-kona-soft">
          <h2 className="text-2xl font-semibold text-kona-taupe">
            Valley Medical Center — Coffee Truck
          </h2>
          <p className="text-sm text-kona-white/85 mt-1">
            751 S Bascom Ave, San Jose, CA
          </p>
          {/*
            Three blocks, deliberately not one list of days. The truck is at
            this address on weekdays only; Saturday is a different place
            entirely, and Sunday is nowhere. Presenting them together as a
            week would tell a visitor the hospital forecourt is open on a
            Saturday, which it is not.
          */}
          <dl className="mt-4 space-y-3">
            {truckSchedule.map((block) => (
              <div key={block.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-kona-taupe">
                  {block.label}
                </dt>
                <dd className="text-sm text-kona-white">{block.when}</dd>
                {block.note ? (
                  <dd className="text-sm text-kona-white/70">{block.note}</dd>
                ) : null}
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <a
              href="https://kona-island-coffee.square.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-kona-brown/50 px-5 py-2 text-sm font-semibold text-kona-brown hover:bg-kona-brown/10 transition-colors"
            >
              Order Truck Online →
            </a>
          </div>
        </section>

        {/* ── Saturday Bay Area Route ── */}
        <section className="rounded-2xl ring-1 ring-neutral-700/60 bg-black/10 p-6 shadow-kona-soft">
          <h2 className="text-2xl font-semibold text-kona-taupe">
            Saturday Bay Area Route
          </h2>
          <p className="text-sm text-kona-white/85 mt-1">
            Rotating Community Locations
          </p>
          <p className="mt-2 text-sm text-kona-white/85 leading-relaxed">
            On Saturdays, our coffee truck rotates between our regular Bay Area
            communities: Elan at River Oaks Apartments (San Jose), Turing at The
            Fields (Milpitas), The Dean (Mountain View), and Communications
            Hill.
          </p>
          {/*
            The Saturday time is not repeated here. It lives in the schedule
            above, beside the two other blocks it has to be read against; this
            section says where the truck goes, not when.
          */}
        </section>

      </div>

      {/* Footer image */}
      <div className="mt-12">
        <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden shadow-kona-soft">
          <Image
            src="/images/locations-footer.jpg"
            alt="Kona Island Coffee truck at a Bay Area location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      {/* CTA link */}
      <div className="mt-10">
        <a href="/catering" className="underline text-kona-white/90">
          Book our trailer for private events →
        </a>
      </div>
    </main>
  );
}
