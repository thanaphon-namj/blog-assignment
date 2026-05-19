"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please fill fields.");
      return;
    }

    setFormError(null);

    try {
      await login(email, password);
    } catch {
      // error
    }
  };

  const handleFill = () => {
    setEmail("admin@example.com");
    setPassword("Admin123!");
    setFormError(null);
  };

  useEffect(() => {
    if (globalThis.window && localStorage.getItem("token")) {
      router.replace("/posts");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white/95 p-8 rounded-2xl border border-blue-100/85">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Sign In</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(formError || error) && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center text-sm font-medium text-red-600">
              {formError || error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-900 text-sm"
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-slate-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-900 text-sm"
                onChange={(e) => setPassword(e.target.value.trim())}
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <hr className="border-slate-200" />

        <div className="text-center">
          <button
            type="button"
            onClick={handleFill}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
          >
            Demo User
          </button>
        </div>
      </div>
    </div>
  );
}
