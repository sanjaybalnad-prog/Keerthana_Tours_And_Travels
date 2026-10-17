
import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";
import { authApi } from "@/features/auth.api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Keerthana Travels" },
      {
        name: "description",
        content: "Admin sign-in for Keerthana Travels.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await authApi.login({ email, password });

      await navigate({ to: "/admin/dashboard" });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
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
