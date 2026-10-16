import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Keerthana Travels" },
      { name: "description", content: "Transactions and bookings overview." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <PageShell>
      <section className="py-16">
        <div className="kt-stagger max-w-2xl">
          <span className="block font-body text-xs uppercase tracking-[0.25em] text-accent">
            Admin
          </span>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
            Transactions and booking activity will show up here.
          </p>
        </div>

        {/* Placeholder — transactions UI to be designed later */}
        <div className="kt-glass kt-rise mt-10 grid min-h-[40vh] place-items-center rounded-3xl border-dashed p-10">
          <p className="text-sm text-ink/50">
            No transactions yet — this area is a work in progress.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
