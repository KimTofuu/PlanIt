"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function SignUp() {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registration successful!");
      window.location.href = "../dashboard";
    } catch (err: any) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Join Shoply — fast checkout, order tracking, and exclusive offers.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-sm font-medium">Full name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Confirm password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-foreground text-background rounded-md font-medium disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}

        <div className="mt-4 text-sm text-center text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link href="../sign-in" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
