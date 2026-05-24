// lib/query-keys.ts
export const queryKeys = {
  currentUser: ["currentUser"] as const,
  listingDrafts: ["listingDrafts"] as const,
  createDraft: ["createDraft"] as const,
  draft: (vehicleId: string) => ["draft", vehicleId] as const,
  brands: () => ["vehicles", "brands"] as const,
  models: (brandId: string) => ["vehicles", "models", brandId] as const,
  features: () => ["vehicles", "features"] as const,
  // add more as your app grows
  // bookings: ["bookings"] as const,
};
