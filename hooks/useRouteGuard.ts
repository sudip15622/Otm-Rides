// hooks/useRouteGuard.ts
"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDraft } from "@/contexts/DraftContext";
import {
  sequenceIndexBySlug,
  maxReachableIndex,
  ROUTES,
} from "@/lib/host/routes";

function getSlugFromPath(pathname: string): string {
  // /become-a-host/[id]/basic-info → "basic-info"
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export function useRouteGuard() {
  const { draft } = useDraft(); // useDraft now also exposes isLoading
  const router = useRouter();
  const pathname = usePathname();

  const slug = getSlugFromPath(pathname);
  const requestedIndex = sequenceIndexBySlug.get(slug) ?? 0;

  // While the draft is still loading, we don't know maxReachableIndex yet —
  // treat as blocked (renders null) rather than guessing.
  const isLoadingDraft = !draft;
  const isBlocked =
    !isLoadingDraft && requestedIndex > maxReachableIndex(draft.draftStep);

  useEffect(() => {
    if (isBlocked && draft) {
      const targetIndex = maxReachableIndex(draft.draftStep);
      const targetSlug = ROUTES[targetIndex]?.slug ?? "overview";
      router.replace(`/become-a-host/${draft.id}/${targetSlug}`);
    }
  }, [isBlocked, draft, router]);

  return { isBlocked: isBlocked || isLoadingDraft };
}
