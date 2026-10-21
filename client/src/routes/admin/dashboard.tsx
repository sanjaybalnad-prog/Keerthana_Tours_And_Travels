import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";
import { Lead as LeadCard } from "@/components/Lead";
import { authApi } from "@/features/auth.api";
import { leadApi } from "@/features/lead.api";
import type { Lead as LeadType } from "@/types/api.types";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Keerthana Travels" },
      {
        name: "description",
        content: "Transactions and bookings overview.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [error, setError] = useState("");

  async function loadLeads() {
    setLoadingLeads(true);
    setError("");

    try {
      const response = await leadApi.getLeads();
      setLeads(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load bookings."
      );
    } finally {
      setLoadingLeads(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        await authApi.getMe();
        setAuthorized(true);

        await loadLeads();
      } catch {
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, []);

  function handleLeadUpdated(updatedLead: LeadType) {
    setLeads((current) =>
      current.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );
  }

  function handleLeadDeleted(id: string) {
    setLeads((current) =>
      current.filter((lead) => lead._id !== id)
    );
  }

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

          <p className="mt-4 text-sm text-ink/60">
            Manage tour bookings and customer enquiries.
          </p>
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
          <div className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-ink">
                  Bookings
                </h2>

                <p className="mt-1 text-sm text-ink/60">
                  {leads.length}{" "}
                  {leads.length === 1 ? "booking" : "bookings"}
                </p>
              </div>

              <button
                type="button"
                onClick={loadLeads}
                disabled={loadingLeads}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition hover:bg-ink/5 disabled:opacity-50"
              >
                {loadingLeads ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="kt-glass rounded-2xl border border-red-500/30 p-5"
              >
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="mt-3 text-sm font-medium text-ink underline disabled:opacity-50"
                >
                  Try again
                </button>
              </div>
            )}

            {loadingLeads && leads.length === 0 ? (
              <p className="py-12 text-center text-sm text-ink/60">
                Loading bookings...
              </p>
            ) : !error && leads.length === 0 ? (
              <div className="kt-glass mt-6 grid min-h-[30vh] place-items-center rounded-3xl border-dashed p-10">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-ink">
                    No bookings yet
                  </h3>

                  <p className="mt-2 text-sm text-ink/60">
                    Successful bookings will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    onUpdated={handleLeadUpdated}
                    onDeleted={handleLeadDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}
