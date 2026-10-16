import { createFileRoute, Link } from "@tanstack/react-router";

import kodaikanalImage from "../assets/kodaikanal-lake.jpg";
import { PageShell } from "../components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keerthana Travels — Journeys worth remembering" },
      {
        name: "description",
        content:
          "Small-group tours and private journeys across South India — crafted by people who know every winding road, quiet temple, and mountain dawn.",
      },
      {
        property: "og:title",
        content: "Keerthana Travels — Journeys worth remembering",
      },
      {
        property: "og:description",
        content:
          "Small-group tours and private journeys across South India, planned by hand since 2009.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <section className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="kt-stagger lg:col-span-3">
          <h1 className="font-display leading-[0.95] tracking-tight text-ink">
            <span className="block text-6xl md:text-7xl">Journeys</span>
            <span className="block text-6xl italic text-brand md:text-7xl">
              worth remembering.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            Small-group tours and private journeys across the South — crafted by
            people who know every winding road, quiet temple, and mountain dawn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:brightness-110"
            >
              Explore itineraries
            </Link>
            <Link
              to="/destinations"
              className="rounded-full bg-white/50 px-6 py-3 text-sm font-semibold text-ink outline-1 -outline-offset-1 outline-black/5 transition hover:bg-white/80"
            >
              Browse destinations
            </Link>
          </div>
          <div className="mt-10 flex gap-8">
            <Stat value="15k+" label="Travellers" />
            <Stat value="48" label="Destinations" />
            <Stat value="4.9" label="Avg. rating" />
          </div>
        </div>

        <div className="kt-rise lg:col-span-2" style={{ animationDelay: "0.2s" }}>
          <div className="kt-glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
                Featured route
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
                6 days
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              Kodaikanal in Bloom
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Curtin Lake walks, Coonoor tea estates, and a slow Sunday in the
              hills.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl">
              <img
                src={kodaikanalImage}
                alt="Misty Kodaikanal lake surrounded by pine forest"
                className="aspect-[16/10] w-full object-cover transition duration-700 hover:scale-105"
                loading="eager"
              />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="font-body text-xs uppercase tracking-[0.15em] text-ink/50">
                  From
                </div>
                <div className="font-display text-xl font-semibold text-brand">
                  ₹18,400
                </div>
              </div>
              <Link
                to="/contact"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="kt-stagger mt-16 grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="kt-glass rounded-3xl p-6 transition duration-500 hover:-translate-y-1.5"
          >
            <div
              className={`grid size-11 place-items-center rounded-2xl ${feature.bg} text-xl`}
            >
              {feature.icon}
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="kt-rise mt-16 flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-14 text-center">
        <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
          Not sure where to begin?
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          Tell us the month and the mood. We will shape a route around it and
          send a plan within a day.
        </p>
        <Link
          to="/contact"
          className="mt-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
        >
          Start planning
        </Link>
      </section>
    </PageShell>
  );
}

const features = [
  {
    icon: "🚐",
    title: "Private & small groups",
    description:
      "Never more than twelve travellers, and your own driver who has done the road before.",
    bg: "bg-accent/20",
  },
  {
    icon: "🧭",
    title: "Locally guided",
    description:
      "Every leg is walked with a host who grew up near the place you are visiting.",
    bg: "bg-brand/10",
  },
  {
    icon: "🗺️",
    title: "Fully planned",
    description:
      "Stays, meals and transfers arranged in one place — you just show up and travel.",
    bg: "bg-ink/5",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-ink">{value}</div>
      <div className="mt-1 font-body text-xs uppercase tracking-[0.15em] text-ink/50">
        {label}
      </div>
    </div>
  );
}
