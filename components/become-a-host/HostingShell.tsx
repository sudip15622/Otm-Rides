"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchDraft } from "@/lib/api/become-a-host";
import { queryKeys } from "@/lib/query-keys";
import { DraftProvider } from "@/contexts/draftContext";
import { StepFormProvider } from "@/contexts/stepFormContext";
import { SaveAndExitButton } from "./SaveExitButton";
import Link from "next/link";
import Image from "next/image";
import { HelpCircle } from "lucide-react";

const TOTAL_STEPS = 8;

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
  } = useQuery({
    queryKey: queryKeys.draft(vehicleId),
    queryFn: () => fetchDraft(vehicleId),
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading && (isError || !draft)) {
      router.replace("/become-a-host");
    }
  }, [draft, isError, isLoading, router]);

  if (isLoading) {
    // Return a minimal shell — replace with your skeleton component
    return <div>Loading...</div>;
  }

  if (isError || !draft) {
    return null;
  }

  return (
    <DraftProvider vehicleId={vehicleId} initialData={draft}>
      <StepFormProvider>
        <div className="min-h-screen flex flex-col bg-card">
          {/* Navbar */}
          <header className="flex items-center justify-between bg-card sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 h-24">
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

            <SaveAndExitButton
              vehicleId={vehicleId}
              currentStep={currentStep}
            />

            {/* <div className="flex items-center gap-4">
              <Link
                href="/hosting"
                className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm flex items-center gap-2"
              >
                <HelpCircle className="size-4" />
                Get help
              </Link>

              
            </div> */}
          </header>

          {/* Step content */}
          <main className="flex-1 max-w-3xl w-full mx-auto pb-30 px-4 sm:px-8 md:px-12 lg:px-16 bg-card">
            {children}
          </main>
        </div>
      </StepFormProvider>
    </DraftProvider>
  );
}
