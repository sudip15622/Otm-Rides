"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStepForm } from "@/contexts/stepFormContext";
import { saveStepApi } from "@/lib/api/become-a-host";

interface SaveAndExitButtonProps {
  vehicleId: string;
  currentStep: number;
}

export function SaveAndExitButton({
  vehicleId,
  currentStep,
}: SaveAndExitButtonProps) {
  const router = useRouter();
  const { getFormData } = useStepForm();
  const [isLoading, setIsLoading] = useState(false);

  // Steps 3 and 6 save individually on upload — no batch partial save needed
  const stepsWithPartialSave = [1, 2, 4, 5];
  const hasPartialSave = stepsWithPartialSave.includes(currentStep);

  async function handleSaveAndExit() {
    setIsLoading(true);
    try {
      if (hasPartialSave) {
        const formData = getFormData();
        if (formData && Object.keys(formData).length > 0) {
          await saveStepApi(vehicleId, currentStep, formData, true);
        }
      }
      // Steps 3 & 6: photos/docs already saved on upload — just navigate away
      router.push("/become-a-host");
    } catch {
      // Fail silently — Save & Exit should never block the user from leaving
      router.push("/become-a-host");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleSaveAndExit}
      disabled={isLoading}
      className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm disabled:cursor-not-allowed"
    >
      {isLoading ? "Saving..." : "Save & Exit"}
    </button>
  );
}
