"use client";
import { useStepForm } from "@/contexts/stepFormContext";
import { saveStepApi } from "@/lib/api/become-a-host";
import { queryKeys } from "@/lib/query-keys";
import { DraftVehicle } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

// Steps that have a form and support partial save.
// Keep this co-located with step definitions — update here when adding steps.
const STEPS_WITH_FORM = [1, 2, 3, 5, 6];

interface StepNavbarProps {
  vehicleId: string;
  currentStep: number;
}

const StepNavbar = ({ vehicleId, currentStep }: StepNavbarProps) => {
  const router = useRouter();
  const { getSaveData } = useStepForm();
  const queryClient = useQueryClient();

  const saveAndExitMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      saveStepApi(vehicleId, currentStep, data, true),
    onSuccess: (updatedDraft) => {
      // Merge partial response into existing cache
      queryClient.setQueryData(
        queryKeys.draft(vehicleId),
        (previous: DraftVehicle | undefined) =>
          previous ? { ...previous, ...updatedDraft } : updatedDraft,
      );
      // Invalidate so next visit gets canonical data
      queryClient.invalidateQueries({ queryKey: queryKeys.draft(vehicleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.listingDrafts });

      toast.success("Saved! You can resume from this step next time.");
      router.push("/");
    },
    onError: () => {
      // FIX #2: Don't silently redirect on error — stay on page, tell the user
      toast.error("Failed to save. Please try again.");
    },
  });

  async function handleSaveAndExit() {
    if (!STEPS_WITH_FORM.includes(currentStep)) {
      // Steps 4, 7, 8 — no form data, safe to just exit
      router.push("/");
      return;
    }

    // FIX #1+#3: getSaveData() returns only individually valid fields, or null.
    // No separate canSaveCheck needed — the check and the data are the same operation.
    const saveData = getSaveData();

    if (saveData === null) {
      // Nothing valid to save — exit without hitting the API
      toast.info("No valid data to save. Exiting without saving.");
      router.push("/");
      return;
    }

    saveAndExitMutation.mutate(saveData);
  }

  return (
    <header className="flex items-center justify-between bg-card fixed z-50 top-0 left-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 h-24">
      <Link href="/" className="relative w-10 h-10 opacity-80">
        <Image
          src="/otmrides_black-01.png"
          alt="logo"
          fill
          sizes="48px"
          className="object-cover w-full h-full"
          priority
        />
      </Link>
      <button
        onClick={handleSaveAndExit}
        // FIX #3: was `!canSaveCheck` which checked the function reference (always truthy).
        // Now correctly disabled only while a save is in flight.
        disabled={saveAndExitMutation.isPending}
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
    </header>
  );
};

export default StepNavbar;
