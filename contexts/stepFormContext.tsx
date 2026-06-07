"use client";
import { createContext, useContext, useRef, useCallback } from "react";

// Returns only the fields that are safe to save (individually valid),
// or null if there is nothing worth saving (e.g. untouched empty step).
type GetSaveDataFn = () => Record<string, any> | null;

interface StepFormContextValue {
  // Each step registers this on mount so the navbar can call it
  registerGetSaveData: (fn: GetSaveDataFn) => void;
  // StepNavbar calls this on "Save & Exit" click
  getSaveData: () => Record<string, any> | null;
}

const StepFormContext = createContext<StepFormContextValue | null>(null);

export function StepFormProvider({ children }: { children: React.ReactNode }) {
  // useRef so registration never triggers a re-render
  const getSaveDataRef = useRef<GetSaveDataFn>(() => null);

  const registerGetSaveData = useCallback((fn: GetSaveDataFn) => {
    getSaveDataRef.current = fn;
  }, []);

  const getSaveData = useCallback((): Record<string, any> | null => {
    return getSaveDataRef.current();
  }, []);

  return (
    <StepFormContext.Provider value={{ registerGetSaveData, getSaveData }}>
      {children}
    </StepFormContext.Provider>
  );
}

export function useStepForm() {
  const ctx = useContext(StepFormContext);
  if (!ctx) throw new Error("useStepForm must be used inside StepFormProvider");
  return ctx;
}
