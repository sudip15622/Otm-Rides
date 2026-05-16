"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import "@/lib/interceptors";
import { getCurrentUser } from "@/lib/api/profile";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface AuthContextType {
  user: User | undefined;
  loading: boolean;
  loginWithGoogle: (returnTo?: string) => void;
  loginWithApple: (returnTo?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<User | null>(null);

  const {
    data: user,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
  });

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
