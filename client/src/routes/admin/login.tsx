import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Keerthana Travels" },
      { name: "description", content: "Admin sign-in for Keerthana Travels." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-16">
        <div className="kt-glass kt-stagger rounded-3xl p-8">
          <span className="block font-body text-xs uppercase tracking-[0.25em] text-accent">
            Staff only
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            Admin login
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Sign in to manage bookings, transactions, and site content.
          </p>

          {/* Mock form — no submit behavior yet */}
          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/60"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@keerthanatravels.com"
                className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/60"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition hover:brightness-110"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/50">
            Not an admin?{" "}
            <Link to="/" className="font-medium text-brand hover:underline">
              Back to the site
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
