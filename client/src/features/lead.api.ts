import { request } from "@/utils/api.util";
import type {
    DeleteLeadResponse,
    LeadResponse,
    LeadsListResponse,
    LeadStatus,
    ToggleLeadStatusResponse,
} from "@/types/api.types";

export const leadApi = {
    async getLeads(page = 1, limit = 10, status?: LeadStatus) {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (status) {
            params.set("status", status);
        }

        return request<LeadsListResponse>(
            `/api/admin/leads?${params.toString()}`,
            { method: "GET" }
        );
    },

    async getLeadById(id: string) {
        return request<LeadResponse>(
            `/api/admin/leads/${encodeURIComponent(id)}`,
            {
                method: "GET",
            }
        );
    },

    async toggleLeadStatus(id: string) {
        return request<ToggleLeadStatusResponse>(
            `/api/admin/leads/${encodeURIComponent(id)}/toggle-status`,
            {
                method: "PATCH",
            }
        );
    },

    async deleteLead(id: string) {
        return request<DeleteLeadResponse>(
            `/api/admin/leads/${encodeURIComponent(id)}`,
            {
                method: "DELETE",
            }
        );
    },
};
