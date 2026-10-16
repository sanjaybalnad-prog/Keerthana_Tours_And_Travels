import { createFileRoute } from "@tanstack/react-router";

import { PageShell, PageHeading } from "../components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Keerthana Travels" },
      {
        name: "description",
        content:
          "Tell us where you would like to go and when. We reply with a hand-made plan within a day.",
      },
      { property: "og:title", content: "Contact — Keerthana Travels" },
      {
        property: "og:description",
        content:
          "Tell us where you would like to go and when. We reply within a day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="Get in touch"
        title={
          <>
            Ready <span className="italic text-brand">when you are.</span>
          </>
        }
        subtitle="Share a rough idea — a month, a mood, a place you saw once in a photograph. We will send a plan within a day."
      />

      <section className="kt-rise mt-12 rounded-3xl bg-ink px-8 py-12">
        <form
          className="mx-auto flex max-w-xl flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-full bg-white/10 px-5 py-3 text-sm text-white outline-none ring-1 ring-white/10 transition placeholder:text-white/40 focus:ring-accent"
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-full bg-white/10 px-5 py-3 text-sm text-white outline-none ring-1 ring-white/10 transition placeholder:text-white/40 focus:ring-accent"
            />
          </div>
          <textarea
            rows={4}
            placeholder="Where would you like to go?"
            className="resize-none rounded-2xl bg-white/10 px-5 py-3 text-sm text-white outline-none ring-1 ring-white/10 transition placeholder:text-white/40 focus:ring-accent"
          />
          <button
            type="submit"
            className="mx-auto mt-2 w-fit rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
          >
            Start planning
          </button>
        </form>
      </section>

      <section className="kt-stagger mt-8 grid gap-5 md:grid-cols-3">
        <Card title="Call or write">
          hello@keerthanatravels.in
          <br />
          +91 8123356779
        </Card>
        <Card title="Visit the office">
          123 Race Course Road
          <br />
          Banglore, Karnataka
        </Card>
        <Card title="Office hours">
          Mon — Sat, 9.30am to 7pm
          <br />
          Sundays Holiday
        </Card>
      </section>
    </PageShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="kt-glass rounded-3xl p-6">
      <div className="font-body text-xs uppercase tracking-[0.2em] text-accent">
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{children}</p>
    </div>
  );
}
