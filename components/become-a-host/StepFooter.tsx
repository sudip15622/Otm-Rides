"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StepFooterProps {
  vehicleId: string;
  currentStep: number;
  totalSteps?: number;
  onContinue: () => Promise<void>;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  isLoading?: boolean;
}

export function StepFooter({
  vehicleId,
  currentStep,
  totalSteps = 6,
  onContinue,
  continueLabel = "Continue",
  isContinueDisabled = false,
  isLoading = false,
}: StepFooterProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  function handleBack() {
    if (isFirstStep) {
      router.push("/become-a-host");
    } else {
      router.push(`/become-a-host/${vehicleId}/step/${currentStep - 1}`);
    }
  }

  async function handleContinue() {
    setIsPending(true);
    try {
      await onContinue();
    } finally {
      setIsPending(false);
    }
  }

  const loading = isLoading || isPending;

  return (
    <div className="fixed z-50 left-0 bottom-0 bg-card border-t border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
      <button onClick={handleBack} disabled={loading} type="button">
        Back
      </button>

      <button
        onClick={handleContinue}
        disabled={loading || isContinueDisabled}
        type="button"
        className="py-3 px-8 flex items-center justify-center w-full sm:w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out"
      >
        {loading
          ? "Saving..."
          : isLastStep
            ? "Submit for Review"
            : continueLabel}
      </button>
    </div>
  );
}
