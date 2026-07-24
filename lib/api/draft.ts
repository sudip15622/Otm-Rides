import api from "@/lib/axios";
import { DraftVehicle, ListingDraft } from "@/types/types";
import { AttachImageDto, ReorderImageDto } from "../schemas/draft";

// ── Lookup data ───────────────────────────────────────────────────────────────

export async function getBrands() {
  const res = await api.get("/draft/brands");
  return res.data;
}

export async function getModelsByBrand(brandId: string) {
  const res = await api.get(`/draft/brands/${brandId}/models`);
  return res.data;
}

export async function getFeatures() {
  const res = await api.get("/draft/features");
  return res.data;
}

// ── Draft CRUD ────────────────────────────────────────────────────────────────

export async function getListingDrafts(): Promise<ListingDraft[]> {
  const res = await api.get("/draft");
  return res.data ?? [];
}

export async function getDraft(vehicleId: string): Promise<DraftVehicle> {
  const res = await api.get(`/draft/${vehicleId}`);
  return res.data;
}

export async function createDraft(): Promise<ListingDraft> {
  const res = await api.post("/draft");
  return res.data;
}

export async function deleteDraft(vehicleId: string): Promise<{ id: string }> {
  const res = await api.delete(`/draft/${vehicleId}`);
  return res.data;
}

// ── Step save ─────────────────────────────────────────────────────────────────

// Full save (Continue) — validates entire step, advances draftStep
export async function saveStep(
  vehicleId: string,
  step: number,
  data: Record<string, unknown>,
): Promise<DraftVehicle> {
  const res = await api.patch(`/draft/${vehicleId}/steps/${step}`, data);

  return res.data;
}

// Partial save (Save & Exit) — saves only valid fields, never advances draftStep
export async function saveStepPartial(
  vehicleId: string,
  step: number,
  data: Record<string, unknown>,
): Promise<DraftVehicle> {
  const res = await api.patch(
    `/draft/${vehicleId}/steps/${step}?partial=true`,
    data,
  );
  return res.data;
}

export async function getUploadSignature(vehicleId: string) {
  const res = await api.get(`/draft/${vehicleId}/upload-signature`);
  return res.data as {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
  };
}

export async function attachImage(
  vehicleId: string,
  data: AttachImageDto,
): Promise<DraftVehicle> {
  const res = await api.post(`/draft/${vehicleId}/images`, data);
  return res.data;
}

export async function deleteImage(
  vehicleId: string,
  imageId: string,
): Promise<DraftVehicle> {
  const res = await api.delete(`/draft/${vehicleId}/images/${imageId}`);
  return res.data;
}

export async function reorderImages(
  vehicleId: string,
  data: ReorderImageDto,
): Promise<DraftVehicle> {
  const res = await api.patch(`/draft/${vehicleId}/images/reorder`, data);
  return res.data;
}

export async function setPrimaryImage(
  vehicleId: string,
  imageId: string,
): Promise<DraftVehicle> {
  const res = await api.patch(`/draft/${vehicleId}/images/${imageId}/primary`);
  return res.data;
}
