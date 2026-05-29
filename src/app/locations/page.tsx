"use client";

import React from "react";
import Image from "next/image";

export default function Locations() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Page title */}
      <h1 className="text-4xl font-bold text-kona-taupe mb-8">
        Locations &amp; Hours
      </h1>

      {/* Location cards */}
      <div className="space-y-6">
        {/* Weekday flagship truck */}
        <section className="rounded-2xl ring-1 ring-neutral-700/60 bg-black/10 p-5 shadow-kona-soft">
          <h2 className="text-2xl font-semibold text-kona-taupe">
            Valley Medical Center (San Jose)
          </h2>
          <p className="text-sm text-kona-white/85 mt-1">
            751 S Bascom Ave, San Jose, CA
          </p>
          <p className="mt-2 text-sm text-kona-white">
            Mon–Fri · 7:30am–4:00pm
          </p>
        </section>

        {/* Weekend rotating route */}
        <section className="rounded-2xl ring-1 ring-neutral-700/60 bg-black/10 p-5 shadow-kona-soft">
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
          <p className="mt-2 text-sm text-kona-white font-medium">
            Saturdays · 8:30am–1:30pm · Sundays closed
          </p>
        </section>

        {/* Flagship storefront */}
        <section className="rounded-2xl ring-1 ring-kona-teal/60 bg-black/10 p-5 shadow-kona-soft">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-semibold text-kona-taupe">
              Mountain View Storefront
            </h2>
            <span className="text-xs font-bold uppercase tracking-wide bg-kona-teal text-white px-2 py-0.5 rounded-full">
              Now Open
            </span>
          </div>
          <p className="text-sm text-kona-white/85 mt-1">
            2565 California Street STE 84, Mountain View, CA 94040
          </p>
          <p className="text-sm text-kona-white/70 mt-0.5">
            San Antonio Village Center
          </p>
          <div className="mt-3 text-sm text-kona-white/85 space-y-0.5">
            <p>Monday–Thursday: 6:30am–5:00pm</p>
            <p>Friday: 6:30am–6:00pm</p>
            <p>Saturday: 7:30am–6:00pm</p>
            <p>Sunday: 7:30am–5:00pm</p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=2565+California+Street+STE+84+Mountain+View+CA+94040"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-kona-teal underline underline-offset-2"
          >
            Get Directions →
          </a>
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
