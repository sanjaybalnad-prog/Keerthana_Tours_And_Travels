import { createFileRoute } from "@tanstack/react-router";

import { PageShell, PageHeading } from "../components/page-shell";
import PackageBooking, { TPackage } from "@/components/PackageBooking";

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
        content: "Small-group and private itineraries from four to twelve days across South India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PackagesPage,
});

const packages: TPackage[] = [
  {
    id: 1,
    name: "Coonoor Highlands",
    duration: "4 days · 8 travellers",
    price: 12900,
    includes: ["Estate stay", "Toy train ride", "All transfers"],
  },
  {
    id: 2,
    name: "Kodaikanal in Bloom",
    duration: "6 days · 10 travellers",
    price: 18400,
    includes: ["Lake walks", "Guided hikes", "Breakfasts"],
  },
  {
    id: 3,
    name: "Periyar Slow Circuit",
    duration: "5 days · 10 travellers",
    price: 16200,
    includes: ["Bamboo rafting", "Forest lodge", "Naturalist"],
  },
  {
    id: 4,
    name: "Munnar, Theni & Back",
    duration: "7 days · 12 travellers",
    price: 21750,
    includes: ["Two hill stays", "Spice walk", "All meals"],
  },
  {
    id: 5,
    name: "Backwater Fortnight",
    duration: "12 days · private",
    price: 48000,
    includes: ["Houseboat night", "Private car", "Flexible route"],
  },
  {
    id: 6,
    name: "Temple Trail South",
    duration: "5 days · 12 travellers",
    price: 14600,
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
            Itineraries built to be <span className="italic text-brand">taken slowly.</span>
          </>
        }
        subtitle="Fixed departures for small groups, or the same routes reshaped as a private trip. Prices are per person, twin sharing."
      />

      <section className="kt-stagger mt-12 grid gap-5 md:grid-cols-2">
        {packages.map((pack) => (
          <PackageBooking {...pack} key={pack.id} />
        ))}
      </section>
    </PageShell>
  );
}
