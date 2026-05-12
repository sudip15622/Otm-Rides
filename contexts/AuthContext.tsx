"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { User } from "@/types/types";
import "@/lib/interceptors";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  //   login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if we have a valid session
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  // ^ The interceptor handles token refresh here too if needed

  //   const login = async (email: string, password: string) => {
  //     const res = await api.post("/auth/login", { email, password });
  //     setUser(res.data.user); // backend already set cookies
  //   };

  const logout = async () => {
    await api.post("/auth/logout"); // backend clears cookies
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
