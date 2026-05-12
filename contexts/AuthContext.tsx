"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { User } from "@/types/types";
import "@/lib/interceptors";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (returnTo?: string) => void;
  loginWithApple: (returnTo?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const buildAuthUrl = (provider: "google" | "apple", returnTo = "/") => {
    const url = new URL(`${BACKEND_API_URL}/auth/${provider}/login`);
    url.searchParams.set("state", returnTo);
    return url.toString();
  };

  const loginWithGoogle = (returnTo = "/") => {
    window.location.href = buildAuthUrl("google", returnTo);
  };

  const loginWithApple = (returnTo = "/") => {
    window.location.href = buildAuthUrl("apple", returnTo);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithApple, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
