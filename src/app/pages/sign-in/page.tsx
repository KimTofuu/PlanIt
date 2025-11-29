"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { LoginForm } from "../../components/Molecules/Forms";
import type { LoginPayload } from "../../interface/auth";

export default function SignIn() {
  const { login, loginStatus } = useAuth();

  const handleSubmit = async (data: LoginPayload) => {
    try {
      await login(data);
      window.location.href = "/pages/dashboard";
    } catch {
      // Error is handled by useAuth
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Welcome back to PlanIt
        </p>

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

