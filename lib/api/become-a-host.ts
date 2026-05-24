import api from "@/lib/axios";
import { DraftVehicle, ListingDraft } from "@/types/types";

// ── Draft Management ──────────────────────────────────────────────────────────

export async function getListingDrafts(): Promise<ListingDraft[]> {
  const res = await api.get("/host/vehicles/drafts");
  return res.data ?? [];
}

export async function fetchDraft(vehicleId: string): Promise<DraftVehicle> {
  const res = await api.get(`/host/vehicles/${vehicleId}`);
  return res.data;
}

export async function createDraft(): Promise<{ id: string }> {
  const res = await api.post("/host/vehicles");
  return res.data;
}

export async function deleteDraft(vehicleId: string): Promise<void> {
  await api.delete(`/host/vehicles/${vehicleId}`);
}

export async function submitVehicleApi(
  vehicleId: string,
): Promise<DraftVehicle> {
  const res = await api.post(`/host/vehicles/${vehicleId}/submit`);
  return res.data;
}

// ── Step Saves ────────────────────────────────────────────────────────────────

export async function saveStepApi(
  vehicleId: string,
  step: number,
  data: Record<string, any>,
  partial = false,
): Promise<DraftVehicle> {
  const url = `/host/vehicles/${vehicleId}/step/${step}${partial ? "?partial=true" : ""}`;
  const res = await api.patch(url, data);
  return res.data;
}

// ── Images ────────────────────────────────────────────────────────────────────

export async function addImageApi(
  vehicleId: string,
  data: { url: string; publicId: string },
) {
  const res = await api.post(`/host/vehicles/${vehicleId}/images`, data);
  return res.data;
}

export async function deleteImageApi(vehicleId: string, imageId: string) {
  await api.delete(`/host/vehicles/${vehicleId}/images/${imageId}`);
}

export async function reorderImagesApi(
  vehicleId: string,
  order: { id: string; sortOrder: number }[],
) {
  await api.patch(`/host/vehicles/${vehicleId}/images/reorder`, { order });
}

// ── Documents ─────────────────────────────────────────────────────────────────

export async function addDocumentApi(
  vehicleId: string,
  data: {
    docType: string;
    docNumber?: string;
    url: string;
    publicId: string;
    expiresAt?: string;
  },
) {
  const res = await api.post(`/host/vehicles/${vehicleId}/documents`, data);
  return res.data;
}

export async function deleteDocumentApi(vehicleId: string, docId: string) {
  await api.delete(`/host/vehicles/${vehicleId}/documents/${docId}`);
}

// ── Cloudinary ────────────────────────────────────────────────────────────────

export async function getUploadSignature(
  folder: "vehicles/images" | "vehicles/documents",
): Promise<{
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}> {
  const res = await api.get(`/host/cloudinary/sign?folder=${folder}`);
  return res.data;
}

// ── Public: Brands, Models, Features ─────────────────────────────────────────

export async function getBrands() {
  const res = await api.get("/vehicles/brands");
  return res.data;
}

export async function getModelsByBrand(brandId: string) {
  const res = await api.get(`/vehicles/brands/${brandId}/models`);
  return res.data;
}

export async function getFeatures() {
  const res = await api.get("/vehicles/features");
  return res.data;
}
