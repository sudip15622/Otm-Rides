"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDraft } from "@/contexts/draftContext";
import { useStepForm } from "@/contexts/stepFormContext";
import { useStepGuard } from "@/hooks/useStepGuard";
import { saveStepApi } from "@/lib/api/become-a-host";
import { StepFooter } from "@/components/become-a-host/StepFooter";
import { queryKeys } from "@/lib/query-keys";
import {
  SaveStep2FormData,
  saveStep2PartialSchema,
  saveStep2Schema,
} from "@/schemas/become-a-host";
import StepNavbar from "../StepNavbar";
import { toast } from "sonner";

export function Step2Form({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerGetSaveData } = useStepForm();

  // FIX #4: useStepGuard now returns isBlocked.
  // Rendering null while redirect is pending eliminates the flash.
  const { isBlocked } = useStepGuard(2);

  const form = useForm<SaveStep2FormData>({
    resolver: zodResolver(saveStep2Schema),
    defaultValues: {
      transmission: draft.transmission ?? undefined,
      fuelType: draft.fuelType ?? undefined,
      mileage: draft.mileage ?? undefined,
      odometer: draft.odometer ?? undefined,
      condition: draft.condition ?? undefined,
    },
    // FIX #8: "onTouched" so errors only show after a field is touched,
    // but isValid reflects the true state from the initial defaultValues.
    // This means Continue is enabled when draft data is already valid.
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  // FIX #5: Use a ref to hold the form instance so the registered closure
  // always reads the latest getValues() without going stale.
  // `form` from useForm() is stable, but being explicit avoids future issues
  // if the form is ever recreated.
  const formRef = useRef(form);
  formRef.current = form;

  // Register getSaveData — runs once on mount.
  // Uses formRef.current so it always sees the latest form state.
  useEffect(() => {
    registerGetSaveData(() => {
      const values = formRef.current.getValues();

      // Try full partial parse first (fast path — all fields valid)
      const fullResult = saveStep2PartialSchema.safeParse(values);
      if (fullResult.success) {
        // Return null if every field is empty/undefined (nothing worth saving)
        const hasAnyValue = Object.values(fullResult.data).some(
          (v) =>
            v !== undefined &&
            v !== null &&
            !(typeof v === "string" && v.length === 0),
        );
        return hasAnyValue ? fullResult.data : null;
      }

      // Slow path — strip field by field, keep only individually valid values
      const safe: Record<string, any> = {};
      for (const [key, fieldSchema] of Object.entries(
        saveStep2PartialSchema.shape,
      )) {
        const val = (values as Record<string, any>)[key];
        if (
          val !== undefined &&
          val !== null &&
          !(typeof val === "string" && val.length === 0) &&
          (fieldSchema as any).safeParse(val).success
        ) {
          safe[key] = val;
        }
      }

      return Object.keys(safe).length > 0 ? safe : null;
    });
  }, [registerGetSaveData]); // stable ref — runs once

  // Save mutation — isLoading passed directly to StepFooter (FIX #6)
  const saveMutation = useMutation({
    mutationFn: (data: SaveStep2FormData) => saveStepApi(vehicleId, 2, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      router.push(`/become-a-host/${vehicleId}/steps/3`);
    },
    onError: () => {
      toast.error("Failed to save. Please try again.");
    },
  });

  async function handleContinue() {
    const valid = await form.trigger();
    if (!valid) return;
    saveMutation.mutate(form.getValues());
  }

  // FIX #4: Render nothing while guard redirect is in flight
  if (isBlocked) return null;

  return (
    <>
      <StepNavbar currentStep={2} vehicleId={vehicleId} />
      <main className="flex flex-col gap-8 w-full max-w-2xl mx-auto pt-24 pb-34">
        <h1 className="font-bold text-3xl">
          What's your vehicle's specifications?
        </h1>
      </main>

      <StepFooter
        vehicleId={vehicleId}
        currentStep={2}
        onContinue={handleContinue}
        // FIX #6: Pass mutation isPending directly — no local state wrapper
        isLoading={saveMutation.isPending}
        // FIX #8: isValid is computed from defaultValues (seeded from draft),
        // so this is enabled if the draft data is already complete.
        // With mode:"onTouched", errors only appear after fields are touched.
        isContinueDisabled={!form.formState.isValid}
      />
    </>
  );
}
