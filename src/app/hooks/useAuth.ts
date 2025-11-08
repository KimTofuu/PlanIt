"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import type { AuthResponse, UserProfile, LoginPayload, RegisterPayload } from "../interface/auth";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authService.getProfile(token);
      setUser(data);
    } catch {
      logout();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchProfile, token]);

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);
      const res = await authService.login(payload);
      localStorage.setItem(TOKEN_KEY, res.token);
      setUser(res.user);
      setError(null);
      return res;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    if (payload.password !== payload.confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      throw new Error("Passwords do not match");
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: payload.name, email: payload.email, password: payload.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error || "Registration failed");
      throw new Error(data?.error || "Registration failed");
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    token,
    isAuthenticated: !!user,
  };
}
