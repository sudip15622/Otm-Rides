"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDraft } from "@/contexts/draftContext";
import { useStepForm } from "@/contexts/stepFormContext";
import { useStepGuard } from "@/hooks/useStepGuard";
import {
  saveStepApi,
  getBrands,
  getModelsByBrand,
} from "@/lib/api/become-a-host";
import { StepFooter } from "@/components/become-a-host/StepFooter";
import { z } from "zod";
import { queryKeys } from "@/lib/query-keys";

// ── Local schema (mirrors backend saveStep1Schema) ────────────────────────────
// Keep in sync with host.dto.ts on the backend

const step1Schema = z.object({
  modelId: z.string().min(1, "Please select a model"),
  displayName: z.string().min(3).max(60),
  year: z.number().int().min(2000).max(new Date().getFullYear()),
  color: z.string().min(2),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuelType: z.enum(["PETROL", "ELECTRIC"]),
  mileage: z.number().int().min(0).optional(),
  condition: z.enum(["POOR", "GOOD", "EXCELLENT"]),
  plateNumber: z.string().min(4).max(50),
});

type Step1FormData = z.infer<typeof step1Schema>;

export function Step1Form({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerGetFormData } = useStepForm();

  // useStepGuard(1);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      modelId: draft.modelId ?? undefined,
      displayName: draft.displayName ?? undefined,
      year: draft.year ?? undefined,
      color: draft.color ?? undefined,
      transmission: draft.transmission ?? undefined,
      fuelType: draft.fuelType ?? undefined,
      mileage: draft.mileage ?? undefined,
      condition: draft.condition ?? undefined,
      plateNumber: draft.plateNumber ?? undefined,
    },
  });

  const selectedBrandId = form.watch("modelId"); // used to filter models

  // Register form getter for Save & Exit
  useEffect(() => {
    registerGetFormData(() => form.getValues());
  }, []);

  // Brands & Models
  const { data: brands = [] } = useQuery({
    queryKey: queryKeys.brands(),
    queryFn: getBrands,
  });

  const { data: models = [] } = useQuery({
    queryKey: queryKeys.models(selectedBrandId ?? ""),
    queryFn: () => getModelsByBrand(selectedBrandId!),
    enabled: !!selectedBrandId,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: Step1FormData) => saveStepApi(vehicleId, 1, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      router.push(`/become-a-host/${vehicleId}/step/2`);
    },
  });

  async function handleContinue() {
    const valid = await form.trigger();
    if (!valid) return;
    saveMutation.mutate(form.getValues());
  }

  return (
    <div>
      This is step 1 form.
      <StepFooter
        vehicleId={vehicleId}
        currentStep={1}
        onContinue={handleContinue}
        isLoading={saveMutation.isPending}
      />
    </div>
  );
}
