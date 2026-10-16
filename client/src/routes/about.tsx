import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, PageHeading } from "../components/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — Keerthana Travels" },
      {
        name: "description",
        content:
          "A family-run travel company from Banglore, planning journeys across India since 1990.",
      },
      { property: "og:title", content: "About us — Keerthana Travels" },
      {
        property: "og:description",
        content:
          "A family-run travel company from Banglore, planning journeys by hand since 1990.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const milestones = [
  { year: "1990", text: "First tea-route trip, one van and eleven guests." },
  { year: "2014", text: "Opened the Race Course Road office in Coimbatore." },
  { year: "2019", text: "Started small-group departures capped at twelve." },
  { year: "2025", text: "1,200+ journeys planned, still all by hand." },
];

function AboutPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Our story"
        title={
          <>
            Family-run, from a small office in{" "}
            <span className="italic text-brand">Coimbatore.</span>
          </>
        }
        subtitle="We began with a single tea-route trip in 2009. Today we still plan every journey the way a good host would — personally."
      />

      <section className="kt-stagger mt-12 grid gap-5 md:grid-cols-2">
        {milestones.map((item) => (
          <div
            key={item.year}
            className="kt-glass rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5"
          >
            <div className="font-display text-3xl font-semibold text-brand">
              {item.year}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      <section className="kt-rise mt-16 flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-14 text-center">
        <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
          Walked, tasted, slept in.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          Our planners have walked the ghats, sipped the coffees and stayed in
          every homestay they recommend. Nothing on this site is second-hand.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-10">
          <Figure value="1,200+" label="trips planned" />
          <Figure value="38" label="destinations" />
          <Figure value="4.9" label="avg. rating" />
        </div>
        <Link
          to="/contact"
          className="mt-4 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
        >
          Say hello
        </Link>
      </section>
    </PageShell>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-white">
        {value}
      </div>
      <div className="mt-1 font-body text-xs uppercase tracking-[0.15em] text-white/50">
        {label}
      </div>
    </div>
  );
}
