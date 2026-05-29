"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isProtectedRoute } from "./routes";
import "@/lib/interceptors";

export function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => {
      if (pathname && isProtectedRoute(pathname)) {
        router.push("/login-signup");
      }
    };

    window.addEventListener("auth:sessionExpired", handler);
    return () => window.removeEventListener("auth:sessionExpired", handler);
  }, [pathname, router]);

  return null;
}
