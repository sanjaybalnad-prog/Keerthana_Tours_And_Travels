import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, PageHeading } from "../components/page-shell";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages & itineraries — Keerthana Travels" },
      {
        name: "description",
        content:
          "Small-group and private itineraries from four to twelve days across the Nilgiris, Kerala backwaters and temple towns.",
      },
      {
        property: "og:title",
        content: "Packages & itineraries — Keerthana Travels",
      },
      {
        property: "og:description",
        content:
          "Small-group and private itineraries from four to twelve days across South India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PackagesPage,
});

const packages = [
  {
    name: "Coonoor Highlands",
    duration: "4 days · 8 travellers",
    price: "₹12,900",
    includes: ["Estate stay", "Toy train ride", "All transfers"],
  },
  {
    name: "Kodaikanal in Bloom",
    duration: "6 days · 10 travellers",
    price: "₹18,400",
    includes: ["Lake walks", "Guided hikes", "Breakfasts"],
  },
  {
    name: "Periyar Slow Circuit",
    duration: "5 days · 10 travellers",
    price: "₹16,200",
    includes: ["Bamboo rafting", "Forest lodge", "Naturalist"],
  },
  {
    name: "Munnar, Theni & Back",
    duration: "7 days · 12 travellers",
    price: "₹21,750",
    includes: ["Two hill stays", "Spice walk", "All meals"],
  },
  {
    name: "Backwater Fortnight",
    duration: "12 days · private",
    price: "₹48,000",
    includes: ["Houseboat night", "Private car", "Flexible route"],
  },
  {
    name: "Temple Trail South",
    duration: "5 days · 12 travellers",
    price: "₹14,600",
    includes: ["Madurai & Rameswaram", "Local guide", "Heritage stays"],
  },
];

function PackagesPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Popular this season"
        title={
          <>
            Itineraries built to be{" "}
            <span className="italic text-brand">taken slowly.</span>
          </>
        }
        subtitle="Fixed departures for small groups, or the same routes reshaped as a private trip. Prices are per person, twin sharing."
      />

      <section className="kt-stagger mt-12 grid gap-5 md:grid-cols-2">
        {packages.map((pack) => (
          <article
            key={pack.name}
            className="kt-glass flex flex-col rounded-3xl p-7 transition duration-500 hover:-translate-y-1.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {pack.name}
                </h2>
                <div className="mt-1 font-body text-xs text-ink/50">
                  {pack.duration}
                </div>
              </div>
              <div className="text-right">
                <div className="font-body text-[10px] uppercase tracking-[0.15em] text-ink/45">
                  From
                </div>
                <div className="font-display text-lg font-semibold text-brand">
                  {pack.price}
                </div>
              </div>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {pack.includes.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white/55 px-3 py-1 text-xs text-ink/65"
                >
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Enquire
            </Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
