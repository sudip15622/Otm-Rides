"use client";
import { createContext, useContext, useRef, useCallback } from "react";

type GetFormDataFn = () => Record<string, any> | null;
type CanSaveCheckFn = () => boolean;

interface StepFormContextValue {
  // Each step form calls this on mount to register its getValues fn
  registerGetFormData: (fn: GetFormDataFn) => void;
  // SaveAndExitButton calls this to read current form state
  getFormData: () => Record<string, any> | null;
  // Each step can register partial-save validation logic
  registerCanSaveCheck: (fn: CanSaveCheckFn) => void;
  // SaveAndExitButton calls this on click for authoritative partial validation
  canSaveCheck: () => boolean;
}

const StepFormContext = createContext<StepFormContextValue | null>(null);

export function StepFormProvider({ children }: { children: React.ReactNode }) {
  // useRef so registering doesn't cause re-renders
  const getFormDataRef = useRef<GetFormDataFn>(() => null);
  const canSaveCheckRef = useRef<CanSaveCheckFn>(() => false);

  const registerGetFormData = useCallback((fn: GetFormDataFn) => {
    getFormDataRef.current = fn;
  }, []);

  const getFormData = useCallback(() => {
    return getFormDataRef.current();
  }, []);

  const registerCanSaveCheck = useCallback((fn: CanSaveCheckFn) => {
    canSaveCheckRef.current = fn;
  }, []);

  const canSaveCheck = useCallback(() => {
    return canSaveCheckRef.current();
  }, []);

  return (
    <StepFormContext.Provider
      value={{
        registerGetFormData,
        getFormData,
        registerCanSaveCheck,
        canSaveCheck,
      }}
    >
      {children}
    </StepFormContext.Provider>
  );
}

export function useStepForm() {
  const ctx = useContext(StepFormContext);
  if (!ctx) throw new Error("useStepForm must be used inside StepFormProvider");
  return ctx;
}
