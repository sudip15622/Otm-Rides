"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchDraft } from "@/lib/api/become-a-host";
import { queryKeys } from "@/lib/query-keys";
import { DraftProvider } from "@/contexts/draftContext";
import { StepFormProvider } from "@/contexts/stepFormContext";

function getStepFromPath(pathname: string): number {
  const match = pathname.match(/\/steps\/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

export function HostingShell({
  children,
  vehicleId,
}: {
  children: React.ReactNode;
  vehicleId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = getStepFromPath(pathname);

  const {
    data: draft,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.draft(vehicleId),
    queryFn: () => fetchDraft(vehicleId),
    retry: 1, // one automatic retry for transient failures
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isLoading) return;

    // FIX #1: Only redirect on a genuine "not found" (404).
    // Any other error (500, network blip) shows a retry UI instead of
    // silently kicking the user back to the start and losing their place.
    if (!isError && !draft) {
      router.replace("/become-a-host");
    }
  }, [draft, isError, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // replace with your skeleton
  }

  // FIX #1: Transient error — show retry, don't redirect
  if (isError) {
    const is404 = error instanceof Error && error.message.includes("404");

    if (is404) {
      // Draft truly doesn't exist — redirect is appropriate
      router.replace("/become-a-host");
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground text-sm">
          Something went wrong loading your draft.
        </p>
        <button
          onClick={() => refetch()}
          className="py-2 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <DraftProvider vehicleId={vehicleId} initialData={draft}>
      <StepFormProvider>
        <div className="w-full flex flex-col min-h-screen mx-auto px-4 sm:px-8 md:px-12 lg:px-16 bg-card">
          {children}
        </div>
      </StepFormProvider>
    </DraftProvider>
  );
}
