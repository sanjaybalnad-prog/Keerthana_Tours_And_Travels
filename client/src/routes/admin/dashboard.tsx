import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";
import { authApi } from "@/features/auth.api";

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
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {

    async function checkAuth() {
      try {
        await authApi.getMe();

        setAuthorized(true);
      } catch {
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    }

    checkAuth();


  }, []);

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
        </div>

        {checking ? (
          <p className="mt-10 text-sm text-ink/60">
            Checking authentication...
          </p>
        ) : !authorized ? (
          <div className="kt-glass mt-10 rounded-3xl p-10">
            <h2 className="text-2xl font-semibold text-ink">
              Unauthorized
            </h2>

            <p className="mt-3 text-sm text-ink/70">
              You must be logged in as an admin to access this page.
            </p>

            <Link
              to="/admin/login"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm text-white"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <div className="kt-glass kt-rise mt-10 grid min-h-[40vh] place-items-center rounded-3xl border-dashed p-10">
            <p className="text-sm text-ink/50">
              No transactions yet — this area is a work in progress.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}