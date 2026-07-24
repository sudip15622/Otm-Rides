"use client";
import { ROUTES, sequenceIndexBySlug } from "@/lib/host/routes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { PulseLoader } from "react-spinners";

interface FooterProps {
  vehicleId: string;
  onContinue: () => void;
  isLoading: boolean;
  isContinueDisabled: boolean;
  onBack?: () => void;
}

const Footer = ({
  vehicleId,
  onContinue,
  isLoading,
  isContinueDisabled,
  onBack,
}: FooterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.split("/").filter(Boolean).pop()!;
  const currentIndex = sequenceIndexBySlug.get(slug) ?? 0;
  const currentRoute = ROUTES[currentIndex];

  const stepRoutes = ROUTES.filter((r) => r.kind === "step");
  const currentStepPosition = stepRoutes.findIndex((r) => r.slug === slug);

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    if (currentIndex === 0) {
      router.push("/become-a-host");
      return;
    }

    const prevSlug = ROUTES[currentIndex - 1].slug;
    router.push(`/become-a-host/${vehicleId}/${prevSlug}`);
  }

  const isLastStep = currentIndex === ROUTES.length - 1;
  return (
    <footer className="fixed z-50 left-0 bottom-0 bg-card w-full h-24 px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
      {currentRoute.kind === "step" && (
        <div className="absolute top-0 inset-x-0 flex gap-1">
          {stepRoutes.map((r, i) => (
            <div
              key={r.slug}
              className={cn(
                "h-1 flex-1",
                i <= currentStepPosition ? "bg-secondary" : "bg-accent",
              )}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleBack}
        disabled={isLoading}
        type="button"
        className="cursor-pointer py-3 px-4 font-medium rounded-xl hover:bg-accent/50 disabled:cursor-not-allowed"
      >
        Back
      </button>

      <button
        onClick={onContinue}
        disabled={isLoading}
        type="button"
        className="h-12 px-8 flex items-center justify-center gap-2 w-fit text-sm sm:text-base font-medium rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200 ease-in-out cursor-pointer disabled:bg-muted disabled:cursor-not-allowed disabled:text-foreground"
      >
        {isLoading ? (
          <>
            <PulseLoader size={10} />
          </>
        ) : (
          "Next"
        )}
      </button>
    </footer>
  );
};

export default Footer;
