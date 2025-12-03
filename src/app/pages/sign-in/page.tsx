"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { LoginForm } from "../../components/Molecules/Forms";
import GoogleLogin from "../../components/Atoms/GoogleLogin";
import type { LoginPayload } from "../../interface/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  const { login, loginStatus } = useAuth();

  const handleSubmit = async (data: LoginPayload) => {
    const toastId = toast.loading("Signing in...");
    try {
      await login(data);
      toast.success("Welcome back!", { id: toastId });
      setTimeout(() => {
        window.location.href = "/pages/dashboard";
      }, 500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign in",
        { id: toastId }
      );
    }
  };

  const handleGoogleLogin = async (response: any) => {
    const toastId = toast.loading("Signing in with Google...");
    try {
      const res = await fetch("/api/googleLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Google login failed");
      }

      // Store token
      localStorage.setItem("auth_token", data.token);
      
      toast.success("Welcome back!", { id: toastId });
      setTimeout(() => {
        window.location.href = "/pages/dashboard";
      }, 500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google login failed",
        { id: toastId }
      );
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Welcome back to PlanIt
        </p>

        {/* Google Login Button */}
        <div className="mb-6">
          <GoogleLogin onLogin={handleGoogleLogin} />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Login Form */}
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={loginStatus.isPending}
          error={loginStatus.error ? loginStatus.error.message : null}
        />

        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/pages/sign-up"
            className="text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

