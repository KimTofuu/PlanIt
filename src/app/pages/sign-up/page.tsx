"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { RegisterForm } from "../../components/Molecules/Forms";
import type { RegisterPayload } from "../../interface/auth";

export default function SignUp() {
  const { register, registerStatus } = useAuth();

  const handleSubmit = async (data: RegisterPayload) => {
    try {
      await register(data);
      window.location.href = "/pages/dashboard";
    } catch {
      // Error is handled by useAuth
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Join PlanIt — organize your tasks, collaborate with teams, and boost
          productivity.
        </p>

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={registerStatus.isPending}
          error={registerStatus.error ? registerStatus.error.message : null}
        />

        <div className="mt-4 text-sm text-center text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/pages/sign-in"
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
