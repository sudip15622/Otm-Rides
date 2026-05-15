// lib/api/profile.ts
import api from "@/lib/axios";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  roles: string[];
  createdAt: number;
}

export const getProfile = async (): Promise<UserProfile> => {
  const res = await api.get("/user/profile"); // adjust endpoint
  return res.data;
};
