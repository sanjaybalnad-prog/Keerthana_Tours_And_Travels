import { request } from "@/utils/api.util";
import type {
    DeleteLeadResponse,
    LeadResponse,
    LeadsListResponse,
    LeadStatus,
    ToggleLeadStatusResponse,
} from "@/types/api.types";

export const leadApi = {
    async getLeads(status?: LeadStatus) {
        const query = status ? `?status=${encodeURIComponent(status)}` : "";

        return request<LeadsListResponse>(`/api/admin/leads${query}`, {
            method: "GET",
        });
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
