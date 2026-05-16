// lib/api/profile.ts
import api from "@/lib/axios";
import { User } from "@/types/types";

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get("/auth/me"); // adjust endpoint
  return res.data;
};
