
import { request } from "../utils/api.util";
import type {
  AdminUser,
  LoginRequest,
  LoginResponse,
  MeResponse,
  LogoutResponse,
} from "../types/api.types";

const AUTH_URL = "/api/admin/auth";

export const authApi = {
  async login(credentials: LoginRequest): Promise<AdminUser> {
    const response = await request<LoginResponse>(
      `${AUTH_URL}/login`,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
    );

    return response.data;
  },

  async logout(): Promise<void> {
    await request<LogoutResponse>(`${AUTH_URL}/logout`, {
      method: "POST",
    });
  },

  async getMe(): Promise<AdminUser> {
    const response = await request<MeResponse>(
      `${AUTH_URL}/me`,
    );

    return response.data;
  },
};
