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

        {/* Future shop */}
        <section className="rounded-2xl ring-1 ring-neutral-700/60 bg-black/10 p-5 shadow-kona-soft">
          <h2 className="text-2xl font-semibold text-kona-taupe">
            Mountain View (Flagship) — Coming Soon
          </h2>
          <p className="text-sm text-kona-white/85 mt-1">
            San Antonio Village Center · Mountain View
          </p>
          <p className="mt-2 text-sm text-kona-white/85">
            Our first brick-and-mortar shop is opening in Spring 2026.
          </p>
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

      {/* Copyright */}
      <footer className="mt-12 text-center text-xs text-kona-white/60">
        © 2025 Kona Island Coffee — All Rights Reserved.
      </footer>
    </main>
  );
}
