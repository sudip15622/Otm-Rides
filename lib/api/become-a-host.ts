import api from "@/lib/axios";
import { ListingDraft } from "@/types/types";
// import { User } from "@/types/types";

// export const getCurrentUser = async (): Promise<User> => {
//   const res = await api.get("/auth/me"); // adjust endpoint
//   return res.data;
// };

export const getListingDrafts = async (): Promise<ListingDraft[]> => {
  const res = await api.get("/host/vehicles/drafts");
  return res.data;
};
