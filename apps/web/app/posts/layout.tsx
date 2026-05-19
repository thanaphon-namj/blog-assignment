"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import Navbar from "../components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (globalThis.window && !localStorage.getItem("token")) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar name={user?.name} onLogout={logout} />
      {children}
    </div>
  );
}
