"use client";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDraft } from "@/lib/api/become-a-host";
import { queryKeys } from "@/lib/query-keys";
import { DraftVehicle } from "@/types/types";

interface DraftContextValue {
  draft: DraftVehicle;
  // Manually update cache after a mutation resolves
  // Each step's onSuccess calls this with the updated vehicle from server
  updateDraft: (updated: DraftVehicle) => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({
  children,
  vehicleId,
  initialData,
}: {
  children: React.ReactNode;
  vehicleId: string;
  initialData: DraftVehicle;
}) {
  const queryClient = useQueryClient();

  const { data: draft } = useQuery({
    queryKey: queryKeys.draft(vehicleId),
    queryFn: () => fetchDraft(vehicleId),
    initialData, // seeds cache — no loading flash on first render
    staleTime: Infinity, // don't refetch automatically — mutations update it
  });

  function updateDraft(updated: DraftVehicle) {
    queryClient.setQueryData(queryKeys.draft(vehicleId), updated);
  }

  return (
    <DraftContext.Provider value={{ draft: draft!, updateDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside DraftProvider");
  return ctx;
}
