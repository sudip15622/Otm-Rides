import { z } from "zod";

export function extractValidFields<T extends z.ZodRawShape>(
  partialSchema: z.ZodObject<T>,
  values: Record<string, unknown>,
): Record<string, unknown> | null {
  const safe: Record<string, unknown> = {};

  for (const [key, fieldSchema] of Object.entries(partialSchema.shape)) {
    const val = values[key];

    // Field isn't part of this form / was never touched — leave it alone.
    if (val === undefined) continue;

    const isEmpty =
      val === null ||
      val === "" ||
      (typeof val === "number" && Number.isNaN(val));

    if (isEmpty) {
      // Explicit clear — send null so the backend actually nulls it out.
      safe[key] = null;
      continue;
    }

    if ((fieldSchema as z.ZodTypeAny).safeParse(val).success) {
      safe[key] = val;
    }
    // else: invalid mid-typing garbage — skip, keep last good saved value
  }

  return Object.keys(safe).length > 0 ? safe : null;
}
