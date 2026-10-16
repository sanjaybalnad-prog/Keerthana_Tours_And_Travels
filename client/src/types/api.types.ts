
/* ---------- Admin ---------- */

export interface AdminUser {
  id: string;
  email: string;
}

/* ---------- Leads ---------- */

export type LeadStatus = "unread" | "read";

export interface Lead {
  _id: string;
  customer: {
    email: string;
    phone: string;
  };
  package: {
    name: string;
    price: number;
  };
  leadStatus: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Requests ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

/* ---------- API Responses ---------- */

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

/* ---------- Endpoint Responses ---------- */

export type LoginResponse = ApiSuccess<AdminUser> & {
  message: string;
};

export type MeResponse = ApiSuccess<AdminUser>;

export interface LogoutResponse {
  success: true;
  message: string;
}

export interface LeadsListResponse {
  success: true;
  count: number;
  data: Lead[];
}

export type LeadResponse = ApiSuccess<Lead>;

export type ToggleLeadStatusResponse = ApiSuccess<Lead> & {
  message: string;
};

export interface DeleteLeadResponse {
  success: true;
  message: string;
}

export type HealthResponse =
  | LogoutResponse
  | ApiError;
