import { request } from "../services/requestService";
import type { LoginPayload, RegisterPayload, AuthResponse, UserProfile } from "../interface/auth";

export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/pages/sign-in", {
      method: "POST",
      body: data,
    });
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>("//pagessign-up", {
      method: "POST",
      body: data,
    });
  },

  async getProfile(token: string): Promise<UserProfile> {
    return request<UserProfile>("/auth/profile", {
      method: "GET",
      token,
    });
  },
};
