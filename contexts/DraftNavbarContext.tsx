"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

type GetSaveDataFn = () => Record<string, unknown> | null;

interface DraftNavbarContextValue {
  registerSaveData: (fn: GetSaveDataFn) => void;
  getSaveData: () => Record<string, unknown> | null;
}

const DraftNavbarContext = createContext<DraftNavbarContextValue | null>(null);

export function DraftNavbarProvider({ children }: { children: ReactNode }) {
  const ref = useRef<GetSaveDataFn>(() => null);
  const registerSaveData = useCallback((fn: GetSaveDataFn) => {
    ref.current = fn;
  }, []);
  const getSaveData = useCallback(() => ref.current(), []);

  return (
    <DraftNavbarContext.Provider value={{ registerSaveData, getSaveData }}>
      {children}
    </DraftNavbarContext.Provider>
  );
}

export function useDraftNavbar() {
  const ctx = useContext(DraftNavbarContext);
  if (!ctx)
    throw new Error("useDraftNavbar must be inside DraftNavbarProvider");
  return ctx;
}
