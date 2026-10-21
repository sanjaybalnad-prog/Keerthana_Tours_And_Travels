import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../../components/page-shell";
import { Lead as LeadCard } from "@/components/Lead";
import { authApi } from "@/features/auth.api";
import { leadApi } from "@/features/lead.api";
import type { Lead as LeadType } from "@/types/api.types";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 5;

export const Route = createFileRoute("/admin/dashboard")({
  // The router may hand us numbers/booleans (already JSON-parsed) or strings,
  // so accept both.
  validateSearch: (search: Record<string, unknown>) => {
    const page = Number(search["page"]);
    return {
      page: Number.isInteger(page) && page > 0 ? page : 1,
      unread: search["unread"] === true || search["unread"] === "true",
    };
  },

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

// Builds a plain URL (used only as the href fallback for the pagination links).
function buildHref(page: number, unread: boolean) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (unread) params.set("unread", "true");
  const qs = params.toString();
  return qs ? `/admin/dashboard?${qs}` : "/admin/dashboard";
}

function AdminDashboardPage() {
  const { page, unread } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [leads, setLeads] = useState<LeadType[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  function goToPage(nextPage: number, replace = false) {
    navigate({ search: { page: nextPage, unread }, replace });
  }

  // Check admin authentication.
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

  // Fetch the current page of leads.
  useEffect(() => {
    if (!authorized || checking) return;

    let active = true;

    async function loadLeads() {
      setLoading(true);
      setError("");

      try {
        const response = await leadApi.getLeads(
          page,
          PAGE_SIZE,
          unread ? "unread" : undefined
        );

        if (!active) return;

        setLeads(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages);

        // Redirect (client-side, keeping the filter) if the page no longer exists.
        if (page > Math.max(response.totalPages, 1)) {
          navigate({
            search: { page: Math.max(response.totalPages, 1), unread },
            replace: true,
          });
        }
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error ? err.message : "Failed to load bookings."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLeads();

    return () => {
      active = false;
    };
  }, [authorized, checking, page, unread, refreshKey, navigate]);

  function handleLeadUpdated(updatedLead: LeadType) {
    setLeads((current) =>
      current.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );

    // In unread-only mode the lead may no longer belong in the list
    // (e.g. just marked as read), so refetch.
    if (unread) setRefreshKey((key) => key + 1);
  }

  function handleLeadDeleted(id: string) {
    setLeads((current) => current.filter((lead) => lead._id !== id));
    setRefreshKey((key) => key + 1);
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
            <h2 className="text-2xl font-semibold text-ink">Unauthorized</h2>

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
                <h2 className="text-2xl font-semibold text-ink">Bookings</h2>

                <p className="mt-1 text-sm text-ink/60">
                  {total}{" "}
                  {unread
                    ? "unread"
                    : total === 1
                      ? "booking"
                      : "bookings"}
                  {totalPages > 0 && ` · Page ${page} of ${totalPages}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  disabled={loading}
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition hover:bg-ink/5 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>

                <button
                  type="button"
                  // Changing the filter always goes back to page 1.
                  onClick={() => navigate({ search: { page: 1, unread: !unread } })}
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    unread
                      ? "border-accent bg-accent text-white"
                      : "border-ink/15 text-ink hover:bg-ink/5"
                  }`}
                >
                  {unread ? "Show all bookings" : "Show unread only"}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="kt-glass rounded-2xl border border-red-500/30 p-5"
              >
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  className="mt-3 text-sm font-medium text-ink underline"
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <p className="py-12 text-center text-sm text-ink/60">
                Loading bookings...
              </p>
            ) : !error && leads.length === 0 ? (
              <div className="kt-glass mt-6 grid min-h-[30vh] place-items-center rounded-3xl border-dashed p-10">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-ink">
                    {unread ? "No unread bookings" : "No bookings yet"}
                  </h3>

                  <p className="mt-2 text-sm text-ink/60">
                    {unread
                      ? "You're all caught up."
                      : "Successful bookings will appear here."}
                  </p>
                </div>
              </div>
            ) : !error ? (
              <>
                <div className="grid gap-5">
                  {leads.map((lead) => (
                    <LeadCard
                      key={lead._id}
                      lead={lead}
                      onUpdated={handleLeadUpdated}
                      onDeleted={handleLeadDeleted}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={buildHref(page - 1, unread)}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href={buildHref(pageNumber, unread)}
                            isActive={pageNumber === page}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {page < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href={buildHref(page + 1, unread)}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page + 1);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : null}
          </div>
        )}
      </section>
    </PageShell>
  );
}