
/* ---------- Admin ---------- */

export interface AdminUser {
  id: string;
  email: string;
}

/* ---------- Leads ---------- */

export type LeadStatus = "unread" | "read";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  quantity: number;
  price: number;
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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



/* ---------- Payments ---------- */

export interface CreateOrderRequest {
  price: number;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  quantity: number;
  price: number;
}

/* ---------- Payment Responses ---------- */

export type CreateOrderResponse = ApiSuccess<RazorpayOrder>;

export interface VerifyPaymentResponse {
  success: true;
  message: string;
}

