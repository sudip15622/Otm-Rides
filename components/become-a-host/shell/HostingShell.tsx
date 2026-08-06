"use client";
import { DraftProvider } from "@/contexts/DraftContext";
import { DraftNavbarProvider } from "@/contexts/DraftNavbarContext";
import { getDraft } from "@/lib/api/draft";
import { getApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Navbar from "./Navbar";

const HostingShell = ({
  children,
  vehicleId,
}: {
  children: React.ReactNode;
  vehicleId: string;
}) => {
  const router = useRouter();
  const {
    data: draft,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.draft(vehicleId),
    queryFn: () => getDraft(vehicleId),
    retry: 1,
    staleTime: Infinity,
  });

  const { status } = getApiError(error);
  const shouldRedirectHome =
    !isLoading &&
    ((isError && (status === 404 || status === 403)) || (!isError && !draft));

  useEffect(() => {
    if (shouldRedirectHome) {
      router.replace("/become-a-host");
    }
  }, [shouldRedirectHome, router]);

  if (isLoading || shouldRedirectHome) {
    return <div>Loading...</div>;
  }

  if (isError) {
    // status is neither 404 nor 403 here — genuine unexpected error
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 bg-card pt-20">
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
      <DraftNavbarProvider>
        <div className="bg-card flex flex-col min-h-screen">
          <Navbar vehicleId={vehicleId} />
          <main className="w-full flex flex-col mx-auto px-4 sm:px-8 md:px-12 lg:px-16 bg-card">
            {children}
          </main>
        </div>
      </DraftNavbarProvider>
    </DraftProvider>
  );
};

export default HostingShell;
