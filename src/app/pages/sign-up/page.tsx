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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16 text-slate-900 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/60 blur-[160px] dark:bg-indigo-500/20"></div>
        <div className="absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-blue-200/60 blur-[140px] dark:bg-blue-500/20"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl rounded-[32px] border border-slate-200/80 bg-white/85 p-10 shadow-xl shadow-slate-200/60 backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/70">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-3 rounded-full bg-indigo-100/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
              <i className="fa-solid fa-rocket" aria-hidden="true"></i>
              Get Started
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Create a PlanIt account
            </h1>
            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
              Launch new initiatives, collaborate in real time, and stay focused with AI-tailored recommendations for every board you manage.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                <i className="fa-solid fa-people-group mr-2 text-indigo-500 dark:text-indigo-300" aria-hidden="true"></i>
                Invite teammates with ease
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                <i className="fa-solid fa-layer-group mr-2 text-blue-500 dark:text-blue-300" aria-hidden="true"></i>
                Keep every board organized
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                <i className="fa-solid fa-shield-halved mr-2 text-emerald-500 dark:text-emerald-300" aria-hidden="true"></i>
                Privacy-first authentication
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                <i className="fa-solid fa-wand-magic-sparkles mr-2 text-purple-500 dark:text-purple-300" aria-hidden="true"></i>
                AI assistance on day one
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/70 dark:border-slate-700/70 dark:bg-slate-950/70">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Sign up</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Complete the quick form to unlock your new workspace.
              </p>
            </div>

            <RegisterForm
              onSubmit={handleSubmit}
              isLoading={registerStatus.isPending}
              error={registerStatus.error ? registerStatus.error.message : null}
            />

            <div className="text-center text-sm text-slate-500 dark:text-slate-300">
              Already have an account?{" "}
              <Link
                href="/pages/sign-in"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
