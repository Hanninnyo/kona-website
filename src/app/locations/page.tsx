"use client";

import React from "react";
import Image from "next/image";

export default function Locations() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">Locations &amp; Hours</h1>

      <div className="mt-8 space-y-6">
        {/* Weekday flagship truck */}
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft">
          <h2 className="text-xl font-semibold">Valley Medical Center (San Jose)</h2>
          <p className="text-neutral-600">751 S Bascom Ave, San Jose, CA</p>
          <p className="mt-1">Mon–Fri · 7:30am–4:00pm</p>
        </section>

        {/* Weekend rotating route */}
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft">
          <h2 className="text-xl font-semibold">Saturday Bay Area Route</h2>
          <p className="text-neutral-600">Rotating Community Locations</p>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            On Saturdays, our coffee truck rotates between our regular Bay Area communities:
            Elan at River Oaks Apartments (San Jose), Turing at The Fields (Milpitas),
            The Dean (Mountain View), and Communications Hill.
          </p>
          <p className="mt-2 text-sm text-neutral-800 font-medium">
            Saturdays · 8:30am–1:30pm · Sundays closed
          </p>
        </section>

        {/* Future shop */}
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft">
          <h2 className="text-xl font-semibold">Mountain View (Flagship) — Coming Soon</h2>
          <p className="text-neutral-600">San Antonio Village Center · Mountain View</p>
          <p className="mt-1 text-sm text-neutral-700">
            Our first brick-and-mortar shop is opening in Spring 2026.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <a href="/catering" className="underline">
          Book our trailer for private events →
        </a>
      </div>
    </main>
  );
}
