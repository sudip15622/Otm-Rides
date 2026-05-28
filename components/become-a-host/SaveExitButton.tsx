"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStepForm } from "@/contexts/stepFormContext";
import { saveStepApi } from "@/lib/api/become-a-host";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";
import { DraftVehicle } from "@/types/types";

interface SaveAndExitButtonProps {
  vehicleId: string;
  currentStep: number;
}

export function SaveAndExitButton({
  vehicleId,
  currentStep,
}: SaveAndExitButtonProps) {
  const router = useRouter();
  const { getFormData, isFormValid } = useStepForm();

  // Steps 3 and 6 save individually on upload — no batch partial save needed
  const queryClient = useQueryClient();

  const saveAndExitMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      saveStepApi(vehicleId, currentStep, data, true),
    onSuccess: (updatedDraft) => {
      // Partial save responses may omit relations. Merge into existing cache
      // and mark draft stale so the next visit refetches canonical draft data.
      queryClient.setQueryData(
        queryKeys.draft(vehicleId),
        (previous: DraftVehicle | undefined) =>
          previous ? { ...previous, ...updatedDraft } : updatedDraft,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.draft(vehicleId) });
      // Also invalidate the drafts list so draftLastSavedAt updates on landing page
      queryClient.invalidateQueries({ queryKey: queryKeys.listingDrafts });
      toast.success(
        "Successfully saved. You can resume from this step next time.",
      );
      router.push("/");
    },
    onError: () => {
      router.push("/");
      router.refresh();
    },
  });

  async function handleSaveAndExit() {
    const stepsWithPartialSave = [1, 2, 3, 5, 6];
    const shouldDisableForInvalidForm =
      stepsWithPartialSave.includes(currentStep) && !isFormValid;

    if (shouldDisableForInvalidForm) {
      return;
    }

    if (stepsWithPartialSave.includes(currentStep)) {
      const formData = getFormData();
      if (formData && Object.keys(formData).length > 0) {
        saveAndExitMutation.mutate(formData);
        return;
      }
    }

    // Steps 4 and 7 — no form data, just navigate
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSaveAndExit}
      disabled={
        saveAndExitMutation.isPending ||
        (currentStep !== 4 && currentStep !== 7 && !isFormValid)
      }
      className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
    >
      {saveAndExitMutation.isPending ? (
        <>
          <span className="border-t border-foreground/50 rounded-full animate-spin size-3" />
          Saving...
        </>
      ) : (
        "Save & Exit"
      )}
    </button>
  );
}
