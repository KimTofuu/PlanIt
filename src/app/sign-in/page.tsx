"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await login({ email, password });
      alert("Login successful!");
      window.location.href = "../dashboard";
    }catch(err:any){
      alert("Login failed: " + err.message);
    }
  };
  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
          </label>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-foreground text-background rounded-md font-medium disabled:opacity-60"
          >
            {false ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

