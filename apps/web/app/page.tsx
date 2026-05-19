"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (globalThis.window) {
      const token = localStorage.getItem("token");

      if (token) {
        router.replace("/posts");
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  return null;
}
