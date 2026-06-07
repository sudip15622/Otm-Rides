import { z } from "zod";

export const VehicleType = {
  BIKE: "BIKE",
  SCOOTER: "SCOOTER",
} as const;

export const TransmissionType = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
} as const;

export const FuelType = {
  PETROL: "PETROL",
  ELECTRIC: "ELECTRIC",
} as const;

export const VehicleCondition = {
  POOR: "POOR",
  GOOD: "GOOD",
  EXCELLENT: "EXCELLENT",
} as const;

export const CancellationPolicy = {
  FLEXIBLE: "FLEXIBLE",
  MODERATE: "MODERATE",
  STRICT: "STRICT",
  NO_REFUND: "NO_REFUND",
} as const;

export const FuelPolicy = {
  FULL_TO_FULL: "FULL_TO_FULL",
  SAME_LEVEL: "SAME_LEVEL",
  FREE: "FREE",
} as const;

export const LateReturnPolicy = {
  PER_HOUR: "PER_HOUR",
  PER_DAY: "PER_DAY",
  GRACE_ONLY: "GRACE_ONLY",
  NO_POLICY: "NO_POLICY",
} as const;

export const VehicleDocType = {
  BLUEBOOK: "BLUEBOOK",
  INSURANCE: "INSURANCE",
  EMISSION: "EMISSION",
  OTHER: "OTHER",
} as const;

export const IdentityDocType = {
  CITIZENSHIP: "CITIZENSHIP",
  PASSPORT: "PASSPORT",
  DRIVING_LICENSE: "DRIVING_LICENSE",
} as const;

// ── Step 1 — Basics ───────────────────────────────────────────────────────────

export const saveStep1Schema = z.object({
  type: z.enum(VehicleType, { error: "Invalid vehicle type selected" }),

  // both optional at field level — superRefine handles the OR logic
  brandId: z.uuid({ error: "Please select a brand" }),
  modelId: z.uuid({ error: "Please select a model" }),

  year: z
    .number({ error: "Year must be a number" })
    .int()
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),

  // color: z.string().min(2, "Color is required"),
  plateNumber: z
    .string()
    .min(4, "Plate number is too short")
    .max(50, "Plate number is too long"),
});

// Partial — used on "Save & Exit", no cross-field checks
export const saveStep1PartialSchema = saveStep1Schema.partial();

export type SaveStep1FormData = z.infer<typeof saveStep1Schema>;
export type SaveStep1PartialFormData = z.infer<typeof saveStep1PartialSchema>;

export const saveStep2Schema = z.object({
  transmission: z.enum(TransmissionType, {
    error: "Invalid transmission type",
  }),

  fuelType: z.enum(FuelType, { error: "Invalid Fuel type" }),

  mileage: z.number().int().min(0, "Mileage cannot be negative").optional(),
  odometer: z.number().int().min(0, "Odometer cannot be negative").optional(),

  condition: z.enum(VehicleCondition, { error: "Invalid condition" }),
});

export const saveStep2PartialSchema = saveStep2Schema.partial();

export type SaveStep2FormData = z.infer<typeof saveStep2Schema>;
export type SaveStep2PartialFormData = z.infer<typeof saveStep2PartialSchema>;

// ── Step 3 — Location ─────────────────────────────────────────────────────────

export const locationSchema = z.object({
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  province: z.string().min(2, "Province is required"),
  country: z.string().default("Nepal"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const saveStep3Schema = z.object({
  location: locationSchema,
});

export const saveStep3PartialSchema = saveStep3Schema.partial().extend({
  location: locationSchema.partial().optional(),
});

export type SaveStep3FormData = z.infer<typeof saveStep3Schema>;
export type SaveStep3PartialFormData = z.infer<typeof saveStep3PartialSchema>;

// ── Step 5 — Features ─────────────────────────────────────────────────────────

export const saveStep5Schema = z.object({
  featureIds: z.array(z.uuid({ error: "Invalid feature id" })),

  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters")
    .max(60, "Display name must be at most 60 characters"),

  extraFeatures: z
    .string()
    .max(500, "Extra features must be at most 500 characters")
    .optional(),
});

export const saveStep5PartialSchema = saveStep5Schema.partial();

export type SaveStep5FormData = z.infer<typeof saveStep5Schema>;
export type SaveStep5PartialFormData = z.infer<typeof saveStep5PartialSchema>;

// ── Step 5 — Pricing & Policies ───────────────────────────────────────────────

const step6BaseSchema = z.object({
  pricePerDay: z
    .number({ error: "Price must be a number" })
    .min(100, "Minimum price is NPR 100"),
  securityDeposit: z
    .number()
    .min(0, "Security deposit cannot be negative")
    .default(0),
  cancellationPolicy: z.enum(CancellationPolicy, {
    error: "Invalid cancellation policy",
  }),
  fuelPolicy: z.enum(FuelPolicy, { error: "Invalid fuel policy" }),
  lateReturnPolicy: z.enum(LateReturnPolicy, {
    error: "Invalid late return policy",
  }),
  lateReturnFee: z.number().min(0).optional(),
  lateReturnGraceMinutes: z.number().int().min(0).default(0),
  allowOutstation: z.boolean().default(false),
  maxKmPerDay: z.number().int().min(1).optional(),
  extraKmCharge: z.number().min(0).optional(),
  minRiderAge: z.number().int().min(16, "Minimum age is 16").max(99).optional(),
  requireDrivingLicense: z.boolean().default(true),
  allowPillion: z.boolean().default(true),
  helmetRequired: z.boolean().default(true),
  usageNotes: z
    .string()
    .max(500, "Usage notes must be at most 500 characters")
    .optional(),
});

// superRefine only applies on "Next" — not on partial save
export const saveStep6Schema = step6BaseSchema.superRefine((data, ctx) => {
  if (
    data.lateReturnPolicy === LateReturnPolicy.PER_HOUR ||
    (data.lateReturnPolicy === LateReturnPolicy.PER_DAY && !data.lateReturnFee)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["lateReturnFeePerHour"],
      message: "Fee is required for PER_HOUR or PER_DAY policy",
    });
  }
  if (data.maxKmPerDay && !data.extraKmCharge) {
    ctx.addIssue({
      code: "custom",
      path: ["extraKmCharge"],
      message: "Extra km charge is required when max km per day is set",
    });
  }
});

// Partial skips superRefine entirely — no cross-field checks on save & exit
export const saveStep6PartialSchema = step6BaseSchema.partial();

export type SaveStep6FormData = z.infer<typeof saveStep6Schema>;
export type SaveStep6PartialFormData = z.infer<typeof saveStep6PartialSchema>;

// ── Images ────────────────────────────────────────────────────────────────────

export const addImageSchema = z.object({
  url: z.url({ error: "Invalid image URL" }),
  publicId: z.string().min(1, "Cloudinary public ID is required"),
});

export const reorderImagesSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1, "Order array cannot be empty"),
});

export type AddImageFormData = z.infer<typeof addImageSchema>;
export type ReorderImagesFormData = z.infer<typeof reorderImagesSchema>;

// ── Documents ─────────────────────────────────────────────────────────────────

export const addDocumentSchema = z.object({
  docType: z.enum(VehicleDocType, { error: "Invalid document type" }),

  docNumber: z.string().optional(),

  url: z.url({ error: "Invalid document URL" }),
  publicId: z.string().min(1, "Cloudinary public ID is required"),

  expiresAt: z.iso.date({ error: "Invalid date format" }).optional(),
});

export type AddDocumentFormData = z.infer<typeof addDocumentSchema>;

// ── Submit (full validation) ──────────────────────────────────────────────────
// Used in the service at submit time, not as a request body schema.
// Validates the full vehicle record loaded from DB before flipping to PENDING.

export const submitVehicleSchema = z.object({
  type: z.enum(VehicleType),
  //   modelId: z.uuid(),
  displayName: z.string().min(3),
  year: z.number().int().min(2000),
  color: z.string().min(2),
  transmission: z.enum(TransmissionType),
  fuelType: z.enum(FuelType),
  condition: z.enum(VehicleCondition),
  plateNumber: z.string().min(4),
  locationId: z.uuid(),
  // Prisma returns Decimal as string — accept both
  pricePerDay: z.union([z.number(), z.string()]).transform(Number),
});
