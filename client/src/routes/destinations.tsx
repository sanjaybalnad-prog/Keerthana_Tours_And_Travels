import { createFileRoute, Link } from "@tanstack/react-router";

import kodaikanalImage from "../assets/kodaikanal-lake.jpg";
import routeMapImage from "../assets/route-map.jpg";
import { PageShell, PageHeading } from "../components/page-shell";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — Keerthana Travels" },
      {
        name: "description",
        content:
          "Hill stations, backwaters and temple towns across Tamil Nadu and Kerala, each visited and vetted by our own hosts.",
      },
      { property: "og:title", content: "Destinations — Keerthana Travels" },
      {
        property: "og:description",
        content:
          "Hill stations, backwaters and temple towns across Tamil Nadu and Kerala.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DestinationsPage,
});

const destinations = [
  {
    name: "Kodaikanal",
    region: "Tamil Nadu · Hills",
    blurb: "Pine walks, lake mornings and a mist that never quite leaves.",
    best: "Sep — Mar",
  },
  {
    name: "Coonoor",
    region: "Nilgiris · Tea country",
    blurb: "Tea estate stays and the slow toy train down to Mettupalayam.",
    best: "Oct — May",
  },
  {
    name: "Munnar",
    region: "Kerala · Hills",
    blurb: "Green as far as the road goes, with cardamom in the air.",
    best: "Aug — Mar",
  },
  {
    name: "Alleppey",
    region: "Kerala · Backwaters",
    blurb: "A houseboat night, a kettuvallam breakfast, herons at dawn.",
    best: "Nov — Feb",
  },
  {
    name: "Madurai",
    region: "Tamil Nadu · Temple town",
    blurb: "Meenakshi at first light, then the flower market next door.",
    best: "Dec — Mar",
  },
  {
    name: "Periyar",
    region: "Kerala · Forest",
    blurb: "Bamboo rafting, silent trails and a lake full of reflections.",
    best: "Oct — Apr",
  },
];

function DestinationsPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Where we go"
        title={
          <>
            Places we know{" "}
            <span className="italic text-brand">by heart.</span>
          </>
        }
        subtitle="Six regions we return to season after season — close enough to reach easily, far enough to feel like a proper escape."
      />

      <section className="kt-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((place) => (
          <article
            key={place.name}
            className="kt-glass group rounded-3xl p-6 transition duration-500 hover:-translate-y-1.5"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">
                {place.name}
              </h2>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
                {place.best}
              </span>
            </div>
            <div className="mt-1 font-body text-xs uppercase tracking-[0.15em] text-ink/45">
              {place.region}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {place.blurb}
            </p>
            <Link
              to="/packages"
              className="mt-5 inline-block text-sm font-semibold text-brand transition group-hover:translate-x-1"
            >
              See itineraries →
            </Link>
          </article>
        ))}
      </section>

      <section className="kt-rise kt-glass mt-16 grid overflow-hidden rounded-3xl md:grid-cols-2">
        <div className="p-8 md:p-10">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
            The map
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink">
            One loop, many stops
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
            Most of our routes trace the same old ghat roads — you can join for
            four days or stay for a fortnight.
          </p>
          <img
            src={kodaikanalImage}
            alt="Kodaikanal lake at dawn"
            className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
        <div className="grid place-items-center bg-brand/5 p-8 md:p-10">
          <img
            src={routeMapImage}
            alt="Hand-drawn route map over a warm cream landscape"
            className="aspect-square w-full max-w-sm rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
      </section>
    </PageShell>
  );
}
