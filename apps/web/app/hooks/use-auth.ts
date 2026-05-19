"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

export function useAuth(): AuthContextType {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (globalThis.window === undefined) return;

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch<User>("/auth/me");
        setUser(response);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      router.push("/posts");
    } catch (err: unknown) {
      setUser(null);
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  };
}
