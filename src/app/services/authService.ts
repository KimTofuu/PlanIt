import { request } from "./requestService";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UserProfile,
} from "../interface/auth";

export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/api/login", {
      method: "POST",
      body: data,
    });
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/api/register", {
      method: "POST",
      body: data,
    });
  },

  async getProfile(token: string): Promise<UserProfile> {
    return request<UserProfile>('/api/profile', { token });
  },
};
