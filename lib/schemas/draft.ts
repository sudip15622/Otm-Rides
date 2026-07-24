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

// undefined → field untouched, null → explicit "clear this field"
function toPartialNullable<Shape extends z.ZodRawShape>(
  schema: z.ZodObject<Shape>,
) {
  type NullableShape = {
    [K in keyof Shape]: z.ZodOptional<z.ZodNullable<Shape[K]>>;
  };

  const entries = Object.entries(schema.shape).map(
    ([key, value]) =>
      [key, (value as z.ZodTypeAny).nullable().optional()] as const,
  );

  const nullableShape = Object.fromEntries(entries) as unknown as NullableShape;

  return z.object(nullableShape);
}

export const saveStep1Schema = z.object({
  type: z.enum(VehicleType, { error: "Please select a vehicle type" }),

  brandId: z.uuid({ error: "Please select a brand" }),
  modelId: z.uuid({ error: "Please select a model" }),

  year: z
    .number({ error: "Year must be a number" })
    .int()
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),

  plateNumber: z
    .string()
    .min(4, "Plate number is too short")
    .max(50, "Plate number is too long"),
});

// Partial — used on "Save & Exit", no cross-field checks
export const saveStep1PartialSchema = saveStep1Schema.partial();

export type SaveStep1Dto = z.infer<typeof saveStep1Schema>;
export type SaveStep1PartialDto = z.infer<typeof saveStep1PartialSchema>;

// ── Step 2 — Specifications ───────────────────────────────────────────────────────────

export const saveStep2Schema = z.object({
  transmission: z.enum(TransmissionType, {
    error: "Please select a transmission type",
  }),

  fuelType: z.enum(FuelType, { error: "Please select a fuel type" }),

  mileage: z
    .number()
    .int()
    .min(0, "Mileage cannot be negative")
    .optional()
    .transform((val) => (Number.isNaN(val as number) ? undefined : val)),

  odometer: z
    .number()
    .int()
    .min(0, "Odometer cannot be negative")
    .optional()
    .transform((val) => (Number.isNaN(val as number) ? undefined : val)),

  condition: z.enum(VehicleCondition, { error: "Please select a condition" }),
});

export const saveStep2PartialSchema = saveStep2Schema.partial();

export type SaveStep2Dto = z.infer<typeof saveStep2Schema>;
export type SaveStep2PartialDto = z.infer<typeof saveStep2PartialSchema>;

export const saveStep3Schema = z.object({
  address: z.string().min(2, "Address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  province: z.string().min(2, "Province is required"),
  country: z.string().min(1),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const saveStep3PartialSchema = saveStep3Schema.partial();

export type SaveStep3Dto = z.infer<typeof saveStep3Schema>;
export type SaveStep3PartialDto = z.infer<typeof saveStep3PartialSchema>;

export const saveStep4Schema = z.object({});
export const saveStep4PartialSchema = saveStep4Schema.partial();
export type SaveStep4Dto = z.infer<typeof saveStep4Schema>;

export const MIN_VEHICLE_IMAGES = 3;
export const MAX_VEHICLE_IMAGES = 10;

export const attachImageSchema = z.object({
  url: z.url({ error: "Invalid image URL" }),
  publicId: z.string().min(1, "Cloudinary public ID is required"),
});

export type AttachImageDto = z.infer<typeof attachImageSchema>;

export const reorderImageSchema = z.object({
  order: z
    .array(
      z.object({
        id: z.uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1, "Order array cannot be empty"),
});

export type ReorderImageDto = z.infer<typeof reorderImageSchema>;

export const MAX_VEHICLE_FEATURES = 20;

export const saveStep5Schema = z.object({
  displayName: z
    .string()
    .min(10, "Title is too short")
    .max(60, "Title is too long"),

  featureIds: z
    .array(z.uuid({ error: "Invalid feature selected" }))
    .max(
      MAX_VEHICLE_FEATURES,
      `You can select up to ${MAX_VEHICLE_FEATURES} features`,
    )
    .default([]),

  // free-text extras — maps to Vehicle.extraFeatures in the DB
  additionalFeatures: z.string().max(500, "Description is too long").optional(),
});

export const saveStep5PartialSchema = saveStep5Schema.partial();

export type SaveStep5Dto = z.infer<typeof saveStep5Schema>;
export type SaveStep5PartialDto = z.infer<typeof saveStep5PartialSchema>;

// ── Step schema map — index by step number ────────────

export const fullStepSchemas: Record<number, z.ZodTypeAny> = {
  1: saveStep1Schema,
  2: saveStep2Schema,
  3: saveStep3Schema,
  4: saveStep4Schema,
  5: saveStep5Schema,
};

export const partialStepSchemas: Record<number, z.ZodTypeAny> = {
  1: saveStep1PartialSchema,
  2: saveStep2PartialSchema,
  3: saveStep3PartialSchema,
  4: saveStep4PartialSchema,
  5: saveStep5PartialSchema,
};
