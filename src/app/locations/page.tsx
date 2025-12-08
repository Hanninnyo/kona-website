"use client";

import React from "react";
import Image from "next/image";

export default function Locations() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-kona-white md:text-kona-espresso">
        Locations &amp; Hours
      </h1>

      {/* Locations cards */}
      <div className="mt-8 space-y-6">
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft bg-kona-brown/80 text-white">
          <h2 className="text-xl font-semibold">Valley Medical Center (San Jose)</h2>
          <p className="text-neutral-200">751 S Bascom Ave, San Jose, CA</p>
          <p className="mt-1">Mon–Fri · 7:30am–4:00pm</p>
        </section>

        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft bg-kona-brown/80 text-white">
          <h2 className="text-xl font-semibold">Mountain View (Flagship) — Coming Soon</h2>
          <p className="text-neutral-200">San Antonio Village Center · Mountain View</p>
        </section>
      </div>

      {/* Catering link */}
      <div className="mt-10">
        <a href="/catering" className="underline text-kona-white md:text-kona-espresso">
          Book our trailer for private events →
        </a>
      </div>

      {/* Footer image just above the global copyright */}
      <div className="mt-12 flex justify-center">
        <div className="relative w-full max-w-4xl h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-kona-soft">
          <Image
            src="/images/locations-footer.jpg"
            alt="Kona Island Coffee truck and guests at one of our Bay Area locations"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          />
        </div>
      </div>
    </main>
  );
}
