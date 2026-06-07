"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/contexts/draftContext";

/**
 * Protects a step from being accessed before previous steps are complete.
 * A user can access any step up to draftStep + 1.
 *
 * FIX #4: Returns `isBlocked` so the step component can render `null`
 * synchronously instead of flashing its full UI for one frame while the
 * useEffect redirect is still pending.
 *
 * Usage in a step component:
 *   const { isBlocked } = useStepGuard(3);
 *   if (isBlocked) return null;
 */
export function useStepGuard(requestedStep: number) {
  const { draft } = useDraft();
  const router = useRouter();

  // Compute synchronously during render — no stale closure risk
  const maxAllowed = draft.draftStep + 1;
  const isBlocked = requestedStep > maxAllowed;

  useEffect(() => {
    if (isBlocked) {
      router.replace(`/become-a-host/${draft.id}/step/${draft.draftStep}`);
    }
  }, [isBlocked, draft.id, draft.draftStep, router]);

  return { isBlocked };
}
