import { useState } from "react";
import type { Lead as LeadType } from "@/types/api.types";
import { leadApi } from "@/features/lead.api";

interface LeadProps {
    lead: LeadType;
    onUpdated: (lead: LeadType) => void;
    onDeleted: (id: string) => void;
}

export function Lead({ lead, onUpdated, onDeleted }: LeadProps) {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleToggleStatus() {
        setUpdatingStatus(true);
        setError("");

        try {
            const response = await leadApi.toggleLeadStatus(lead._id);
            onUpdated(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update lead status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `Move the booking for ${lead.name} to deleted leads?`
        );

        if (!confirmed) return;

        setDeleting(true);
        setError("");

        try {
            await leadApi.deleteLead(lead._id);
            onDeleted(lead._id);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete lead."
            );
        } finally {
            setDeleting(false);
        }
    }

    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(lead.price);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(lead.createdAt));

    return (
        <article
            className={"kt-glass rounded-2xl border p-5 transition"}
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-ink">
                            {lead.name}
                        </h2>

                        {lead.leadStatus === "unread" && (
                            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                                NEW
                            </span>
                        )}

                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${lead.leadStatus === "unread"
                                    ? "bg-accent/15 text-accent"
                                    : "bg-ink/10 text-ink/60"
                                }`}
                        >
                            {lead.leadStatus === "unread" ? "Unread" : "Read"}
                        </span>
                    </div>

                    <p className="mt-1 break-all text-sm text-ink/60">
                        {lead.email}
                    </p>

                    <p className="mt-1 text-sm text-ink/60">
                        {lead.phone}
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <p className="font-semibold text-ink">{formattedPrice}</p>
                    <p className="mt-1 text-xs text-ink/50">
                        {formattedDate}
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-xl bg-ink/[0.04] p-4">
                <p className="text-xs uppercase tracking-wider text-ink/50">
                    Tour package
                </p>

                <p className="mt-1 font-medium text-ink">
                    {lead.packageName}
                </p>

                <p className="mt-2 text-sm text-ink/60">
                    Travellers: {lead.quantity}
                </p>
            </div>

            {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={updatingStatus || deleting}
                    className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {updatingStatus
                        ? "Updating..."
                        : lead.leadStatus === "unread"
                            ? "Mark as read"
                            : "Mark as unread"}
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || updatingStatus}
                    className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete booking"}
                </button>
            </div>
        </article>
    );
}
