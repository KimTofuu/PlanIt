"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { authService } from "../services/authService";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "../interface/auth";

const TOKEN_KEY = "auth_token";

const getStoredToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const AUTH_QUERY_KEY = ["auth", "profile"] as const;

function handleAuthSuccess(
  response: AuthResponse,
  queryClient: ReturnType<typeof useQueryClient>
) {
  persistToken(response.token);
  queryClient.setQueryData(AUTH_QUERY_KEY, response.user);
}

export interface AuthHook {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  profileQuery: UseQueryResult<UserProfile>;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  loginStatus: UseMutationResult<AuthResponse, Error, LoginPayload>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  registerStatus: UseMutationResult<AuthResponse, Error, RegisterPayload>;
  logout: () => Promise<void>;
  latestError: string | null;
}

export function useAuth(): AuthHook {
  const queryClient = useQueryClient();
  const token = getStoredToken();

  const profileQuery = useQuery<UserProfile>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => {
      const activeToken = getStoredToken();
      if (!activeToken) {
        throw new Error("Missing auth token");
      }
      return authService.getProfile(activeToken);
    },
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });

  const loginStatus = useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (data) => {
      handleAuthSuccess(data, queryClient);
    },
  });

  const registerStatus = useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload) => {
      if (payload.password !== payload.confirmPassword) {
        return Promise.reject(new Error("Passwords do not match"));
      }
      return authService.register(payload);
    },
    onSuccess: (data) => {
      handleAuthSuccess(data, queryClient);
    },
  });

  const logout = async () => {
    persistToken(null);
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Ignore network errors; token has already been cleared.
    }
  };

  const latestError = useMemo(() => {
    const error =
      registerStatus.error || loginStatus.error || profileQuery.error;
    return error instanceof Error ? error.message : null;
  }, [registerStatus.error, loginStatus.error, profileQuery.error]);

  const user = useMemo<UserProfile | null>(() => {
    if (profileQuery.data) return profileQuery.data;
    if (loginStatus.data) return loginStatus.data.user;
    if (registerStatus.data) return registerStatus.data.user;
    return null;
  }, [profileQuery.data, loginStatus.data, registerStatus.data]);

  return {
    user,
    token,
    isAuthenticated: Boolean(user),
    profileQuery,
    login: loginStatus.mutateAsync,
    loginStatus,
    register: registerStatus.mutateAsync,
    registerStatus,
    logout,
    latestError,
  };
}
