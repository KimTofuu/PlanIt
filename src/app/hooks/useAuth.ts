"use client";

import { useState, useEffect, useCallback } from "react";
import { LoginPayload, RegisterPayload, UserProfile } from "../interface/auth";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile, token]);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login failed");
        throw new Error(data?.error || "Login failed");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return data;
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

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fName: payload.fName, 
          lName: payload.lName, 
          email: payload.email, 
          password: payload.password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed");
        throw new Error(data?.error || "Registration failed");
      }

      // Auto-login after successful registration
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
      }

      return data;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
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
