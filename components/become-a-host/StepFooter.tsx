"use client";
import { cn } from "@/lib/utils";
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
  totalSteps = 8,
  onContinue,
  continueLabel = "Next",
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
      router.refresh();
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
    <div className="fixed z-50 left-0 bottom-0 bg-card w-full h-24 px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
      {/* progress bar */}
      <div className="absolute top-0 left-0 flex items-center w-full gap-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          return (
            <div
              key={i}
              className={cn(
                "h-1 flex-1",
                i <= currentStep ? "bg-secondary" : "bg-accent",
              )}
            />
          );
        })}
      </div>
      <button
        onClick={handleBack}
        disabled={loading}
        type="button"
        className="cursor-pointer py-3 px-4 font-medium rounded-xl hover:bg-accent/50"
      >
        Back
      </button>

      <div className="hidden sm:flex sm:items-center sm:justify-center text-sm text-muted-foreground">{`step ${currentStep} of ${totalSteps}`}</div>

      <button
        onClick={handleContinue}
        disabled={loading || isContinueDisabled}
        type="button"
        className="py-3 px-8 flex items-center justify-center gap-2 w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out cursor-pointer disabled:bg-muted disabled:cursor-not-allowed disabled:text-foreground"
      >
        {loading ? (
          <>
            <span className="border-t border-border rounded-full size-4 animate-spin" />
            Saving...
          </>
        ) : isLastStep ? (
          "Submit for Review"
        ) : (
          continueLabel
        )}
      </button>
    </div>
  );
}
