"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/lib/interceptors";

export function SessionGuard() {
  const router = useRouter();
  useEffect(() => {
    const handler = () => router.push("/login-signup");
    window.addEventListener("auth:sessionExpired", handler);
    return () => window.removeEventListener("auth:sessionExpired", handler);
  }, [router]);

  return null;
}
