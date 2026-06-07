// ── Enums (mirrored from Prisma) ─────────────────────────────────────────────

export type AuthProvider = "GOOGLE" | "APPLE";
export type Role = "TENANT" | "HOST" | "ADMIN";
export type VerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";
export type VehicleType = "BIKE" | "SCOOTER";
export type TransmissionType = "MANUAL" | "AUTOMATIC";
export type FuelType = "PETROL" | "ELECTRIC";
export type VehicleCondition = "POOR" | "GOOD" | "EXCELLENT";
export type VehicleStatus =
  | "DRAFT"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "UNLISTED"
  | "SUSPENDED";
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
export type IdentityDocType = "CITIZENSHIP" | "PASSPORT" | "DRIVING_LICENSE";
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "DISPUTED";
export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type PaymentGateway = "KHALTI" | "ESEWA";
export type PaymentType = "BOOKING" | "REFUND" | "LATE_FEE" | "EXTRA_KM_FEE";
export type MessageType = "TEXT" | "IMAGE" | "SYSTEM";
export type NotificationType =
  | "BOOKING_REQUEST"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_COMPLETED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "REVIEW_RECEIVED"
  | "VEHICLE_VERIFIED"
  | "VEHICLE_REJECTED"
  | "IDENTITY_VERIFIED"
  | "IDENTITY_REJECTED"
  | "MESSAGE_RECEIVED"
  | "SYSTEM";
export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";

// ── Auth / User ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  avatar: string;
  roles: Role[];
  isHost: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  roles: Role[];
  createdAt: string;
}

// ── Brand & Model ─────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  type: VehicleType;
  engineCC: number | null;
  mileage: number | null;
  brand: Brand;
}

// ── Location ──────────────────────────────────────────────────────────────────

export interface Location {
  id: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  latitude: string | null; // Prisma Decimal → string over JSON
  longitude: string | null;
}

// ── Vehicle Image ─────────────────────────────────────────────────────────────

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

// ── Vehicle Document ──────────────────────────────────────────────────────────

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  docType: VehicleDocType;
  docNumber: string | null;
  url: string;
  publicId: string;
  expiresAt: string | null;
  createdAt: string;
}

// ── Feature ───────────────────────────────────────────────────────────────────

export interface Feature {
  id: string;
  name: string;
  icon: string | null;
}

export interface VehicleFeature {
  vehicleId: string;
  featureId: string;
  feature: Feature;
}

// ── Draft Types ───────────────────────────────────────────────────────────────

// Light shape — only what's needed for draft cards on landing page
export interface ListingDraft {
  id: string;
  displayName: string | null;
  draftStep: number;
  draftLastSavedAt: string | number | Date;
  model: { type: VehicleType } | null;
}

// Full draft shape — used inside the become-a-host flow
export interface DraftVehicle {
  id: string;
  ownerId: string;
  status: VehicleStatus;
  isPublished: boolean;
  draftStep: number;
  draftLastSavedAt: string | number | Date;

  // Step 1 — Basics
  type: VehicleType | null;
  brandId: string | null;
  modelId: string | null;
  // customBrand: string | null;
  // customModel: string | null;
  year: number | null;
  // color: string | null;
  plateNumber: string | null;

  // Step 2 — Specs
  transmission: TransmissionType | null;
  fuelType: FuelType | null;
  mileage: number | null; // km/ltr — user reported
  odometer: number | null; // current odometer reading
  condition: VehicleCondition | null;

  // Step 5 — Features & listing info
  displayName: string | null;
  extraFeatures: string | null;

  // Step 6 — Pricing (Prisma Decimal → string over JSON)
  pricePerDay: string | null;
  securityDeposit: string; // has DB default(0) — always present
  cancellationPolicy: CancellationPolicy;
  fuelPolicy: FuelPolicy;
  lateReturnPolicy: LateReturnPolicy;
  lateReturnFee: string | null;
  lateReturnGraceMinutes: number;

  // Step 6 — Usage rules
  allowOutstation: boolean;
  maxKmPerDay: number | null;
  extraKmCharge: string | null; // Decimal → string
  minRiderAge: number | null;
  requireDrivingLicense: boolean;
  allowPillion: boolean;
  helmetRequired: boolean;
  usageNotes: string | null;

  // Step 3 — Location
  locationId: string | null;
  location: Location | null;

  // Relations
  brand: Brand | null;
  model: VehicleModel | null;
  images: VehicleImage[];
  documents: VehicleDocument[];
  features: VehicleFeature[];

  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}
