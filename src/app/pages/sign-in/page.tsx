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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16 text-slate-900 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-12 h-72 w-72 rounded-full bg-blue-200/60 blur-[140px] dark:bg-blue-500/20"></div>
        <div className="absolute right-12 top-32 h-80 w-80 rounded-full bg-indigo-200/60 blur-[160px] dark:bg-indigo-500/20"></div>
      </div>
      <div className="relative z-10 grid w-full max-w-5xl gap-10 rounded-[32px] border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-200/60 backdrop-blur-2xl transition-colors dark:border-slate-700/70 dark:bg-slate-900/70 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-between gap-10">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-3 rounded-full bg-blue-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
              <i className="fa-solid fa-lock" aria-hidden="true"></i>
              Secure Access
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Welcome back to PlanIt
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 md:text-base">
              Continue where you left off. Collaborate with your teams, keep boards aligned, and stay ahead with AI-driven insights.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                <i className="fa-solid fa-bolt" aria-hidden="true"></i>
              </span>
              Instant board summaries powered by AI
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                <i className="fa-solid fa-diagram-project" aria-hidden="true"></i>
              </span>
              Two-way Trello synchronization
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              </span>
              Enterprise-grade security & single sign-on
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/70 dark:border-slate-700/70 dark:bg-slate-950/70">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Choose a provider or continue with your email credentials.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/70">
            <GoogleLogin onLogin={handleGoogleLogin} />
          </div>

          <div className="relative flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
            or
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></span>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            isLoading={loginStatus.isPending}
            error={loginStatus.error ? loginStatus.error.message : null}
          />

          <p className="text-center text-sm text-slate-500 dark:text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/pages/sign-up"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

