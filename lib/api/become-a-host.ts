import api from "@/lib/axios";
import { ListingDraft } from "@/types/types";

export async function getListingDrafts(): Promise<ListingDraft[]> {
  const res = await api.get("/host/vehicles/drafts");
  return res.data;
}

export async function fetchDraft(vehicleId: string): Promise<any> {
  const res = await api.get(`/host/vehicles/${vehicleId}`);
  return res.data;
}

export async function saveStepApi(
  vehicleId: string,
  step: number,
  data: Record<string, any>,
  partial = false,
): Promise<any> {
  const res = await api.patch(
    `/host/vehicles/${vehicleId}/step/${step}${partial ? "?partial=true" : ""}`,
    data,
  );

  return res.data;
}

export async function submitVehicleApi(vehicleId: string): Promise<any> {
  const res = await api.post(`/host/vehicles/${vehicleId}/submit`);
  return res.data;
}
