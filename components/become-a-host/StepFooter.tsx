"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface StepFooterProps {
  vehicleId: string;
  currentStep: number;
  totalSteps?: number;
  onContinue: () => Promise<void>;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  // FIX #6: Single loading prop — caller owns the mutation isPending.
  // Local isPending state removed to avoid double-tracking and unmount issues.
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

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  function handleBack() {
    if (isFirstStep) {
      router.push("/become-a-host");
    } else {
      router.push(`/become-a-host/${vehicleId}/steps/${currentStep - 1}`);
    }
  }

  // FIX #6: No local isPending state. The parent passes isLoading directly
  // from the mutation. This avoids setState-on-unmounted-component warnings
  // when the route changes before the async call fully resolves.
  return (
    <div className="fixed z-50 left-0 bottom-0 bg-card w-full h-24 px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 flex items-center w-full gap-x-1">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1",
              i <= currentStep ? "bg-secondary" : "bg-accent",
            )}
          />
        ))}
      </div>

      <button
        onClick={handleBack}
        disabled={isLoading}
        type="button"
        className="cursor-pointer py-3 px-4 font-medium rounded-xl hover:bg-accent/50 disabled:cursor-not-allowed"
      >
        Back
      </button>

      <div className="hidden sm:flex sm:items-center sm:justify-center text-sm text-muted-foreground">
        {`Step ${currentStep} of ${totalSteps}`}
      </div>

      <button
        onClick={onContinue}
        disabled={isLoading || isContinueDisabled}
        type="button"
        className="py-3 px-8 flex items-center justify-center gap-2 w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out cursor-pointer disabled:bg-muted disabled:cursor-not-allowed disabled:text-foreground"
      >
        {isLoading ? (
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
