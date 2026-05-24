"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/contexts/draftContext";

/**
 * Protects a step from being accessed before previous steps are complete.
 * A user can access any step up to draftStep + 1.
 * Anything beyond that redirects back to their current step.
 */
export function useStepGuard(requestedStep: number) {
  const { draft } = useDraft();
  const router = useRouter();

  useEffect(() => {
    if (requestedStep > draft.draftStep + 1) {
      router.replace(`/become-a-host/${draft.id}/step/${draft.draftStep}`);
    }
  }, [draft.draftStep, draft.id, requestedStep, router]);
}
