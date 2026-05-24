export interface User {
  id: string;
  name: string;
  avatar: string;
  roles: string[];
  isHost: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  roles: string[];
  createdAt: number;
}

export interface ListingDraft {
  id: string;
  displayName: string | null;
  draftStep: number;
  draftLastSavedAt: Date;
  model: {
    type: VehicleType;
  } | null;
}

// ── Enums (mirrored from Prisma) ─────────────────────────────────────────────

export type VehicleStatus =
  | "DRAFT"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";
export type TransmissionType = "MANUAL" | "AUTOMATIC";
export type FuelType = "PETROL" | "ELECTRIC";
export type VehicleCondition = "POOR" | "GOOD" | "EXCELLENT";
export type CancellationPolicy =
  | "FLEXIBLE"
  | "MODERATE"
  | "STRICT"
  | "NO_REFUND";
export type FuelPolicy = "FULL_TO_FULL" | "SAME_LEVEL" | "FREE";
export type LateReturnPolicy =
  | "PER_HOUR"
  | "PER_DAY"
  | "GRACE_ONLY"
  | "NO_POLICY";
export type VehicleDocType = "BLUEBOOK" | "INSURANCE" | "EMISSION" | "OTHER";

// ── Relations ─────────────────────────────────────────────────────────────────

export interface DraftLocation {
  id: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DraftBrand {
  id: string;
  name: string;
}

export interface DraftModel {
  id: string;
  name: string;
  type: string;
  brand: DraftBrand;
}

export interface DraftImage {
  id: string;
  vehicleId: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface DraftDocument {
  id: string;
  vehicleId: string;
  docType: VehicleDocType;
  docNumber: string | null;
  url: string;
  publicId: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface DraftFeature {
  id: string;
  featureId: string;
  feature: {
    id: string;
    name: string;
    icon: string | null;
  };
}

// ── Main Draft Type ───────────────────────────────────────────────────────────

export interface DraftVehicle {
  id: string;
  ownerId: string;
  status: VehicleStatus;
  isPublished: boolean;
  draftStep: number;
  draftLastSavedAt: string | null;

  // Step 1 — Basics
  modelId: string | null;
  displayName: string | null;
  year: number | null;
  color: string | null;
  transmission: TransmissionType | null;
  fuelType: FuelType | null;
  mileage: number | null;
  condition: VehicleCondition | null;
  plateNumber: string | null;
  extraFeatures: string | null;

  // Step 2 — Location
  locationId: string | null;
  location: DraftLocation | null;

  // Step 5 — Pricing (Prisma Decimal → string over JSON)
  pricePerDay: string | null;
  securityDeposit: string | null;
  lateReturnFeePerHour: string | null;
  lateReturnFeePerDay: string | null;
  extraKmCharge: string | null;

  // Step 5 — Policies
  cancellationPolicy: CancellationPolicy;
  fuelPolicy: FuelPolicy;
  lateReturnPolicy: LateReturnPolicy;
  lateReturnGraceMinutes: number;

  // Step 5 — Usage rules
  allowOutstation: boolean;
  maxKmPerDay: number | null;
  minRiderAge: number | null;
  requireDrivingLicense: boolean;
  allowPillion: boolean;
  helmetRequired: boolean;
  usageNotes: string | null;

  // Relations
  model: DraftModel | null;
  images: DraftImage[];
  documents: DraftDocument[];
  features: DraftFeature[];

  createdAt: string;
  updatedAt: string;
}

// ── Landing page draft list item (from GET /host/vehicles/drafts) ─────────────
// Lighter shape — only what's needed for the draft cards

export interface DraftListItem {
  id: string;
  draftStep: number;
  draftLastSavedAt: string | null;
  displayName: string | null;
  model: { type: string } | null;
}
