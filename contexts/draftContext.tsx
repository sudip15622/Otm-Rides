"use client";

import { getDraft } from "@/lib/api/draft";
import { queryKeys } from "@/lib/query-keys";
import type { DraftVehicle } from "@/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface DraftContextValue {
  draft: DraftVehicle;
  updateDraft: (updated: DraftVehicle) => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({
  children,
  vehicleId,
  initialData,
}: {
  children: ReactNode;
  vehicleId: string;
  initialData: DraftVehicle;
}) {
  const queryClient = useQueryClient();

  const { data: draft } = useQuery({
    queryKey: queryKeys.draft(vehicleId),
    queryFn: () => getDraft(vehicleId),
    initialData,
    staleTime: Infinity,
  });

  const updateDraft = useCallback(
    (updated: DraftVehicle) => {
      queryClient.setQueryData(queryKeys.draft(vehicleId), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.listingDrafts });
    },
    [queryClient, vehicleId],
  );

  return (
    <DraftContext.Provider value={{ draft: draft!, updateDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be inside DraftProvider");
  return ctx;
}
