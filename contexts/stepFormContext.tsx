"use client";
import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";

type GetFormDataFn = () => Record<string, any> | null;

interface StepFormContextValue {
  // Each step form calls this on mount to register its getValues fn
  registerGetFormData: (fn: GetFormDataFn) => void;
  // SaveAndExitButton calls this to read current form state
  getFormData: () => Record<string, any> | null;
  // Step form updates this so shell-level controls can react to validity
  setIsFormValid: (isValid: boolean) => void;
  isFormValid: boolean;
}

const StepFormContext = createContext<StepFormContextValue | null>(null);

export function StepFormProvider({ children }: { children: React.ReactNode }) {
  // useRef so registering doesn't cause re-renders
  const getFormDataRef = useRef<GetFormDataFn>(() => null);
  const [isFormValid, setIsFormValid] = useState(true);

  const registerGetFormData = useCallback((fn: GetFormDataFn) => {
    getFormDataRef.current = fn;
  }, []);

  const getFormData = useCallback(() => {
    return getFormDataRef.current();
  }, []);

  return (
    <StepFormContext.Provider
      value={{ registerGetFormData, getFormData, setIsFormValid, isFormValid }}
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
