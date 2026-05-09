// contexts/SearchDraftContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

export type VehicleType = "Bike" | "Scooter" | "";

interface SearchDraftContextValue {
  location: string;
  setLocation: (loc: string) => void;
  vehicleType: VehicleType;
  setVehicleType: (v: VehicleType) => void;
  dateRange: DateRange | undefined;
  handleDate: (date: Date | undefined) => void;
  reset: () => void;
  buildUrl: (currentParams: URLSearchParams, isSearchPage: boolean) => string;
}

const SearchDraftContext = createContext<SearchDraftContextValue | null>(null);

export function SearchDraftProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // One-way sync: URL → draft (on load and back/forward nav)
  useEffect(() => {
    setLocation(searchParams.get("location") ?? "");
    setVehicleType((searchParams.get("vehicleType") as VehicleType) ?? "");
    const from = searchParams.get("pickupDate");
    const to = searchParams.get("dropoffDate");
    setDateRange(
      from
        ? { from: new Date(from), to: to ? new Date(to) : undefined }
        : undefined,
    );
  }, [searchParams]);

  const handleDate = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        setDateRange(undefined);
        return;
      }
      if (!dateRange?.from) {
        setDateRange({ from: date, to: undefined });
        return;
      }
      if (dateRange.from && !dateRange.to) {
        setDateRange(
          date < dateRange.from
            ? { from: date, to: dateRange.from }
            : { from: dateRange.from, to: date },
        );
        return;
      }
      setDateRange({ from: date, to: undefined });
    },
    [dateRange],
  );

  const reset = useCallback(() => {
    setLocation("");
    setVehicleType("");
    setDateRange(undefined);
  }, []);

  const buildUrl = useCallback(
    (currentParams: URLSearchParams, isSearchPage: boolean) => {
      const p = isSearchPage
        ? new URLSearchParams(currentParams.toString())
        : new URLSearchParams();
      location ? p.set("location", location) : p.delete("location");
      vehicleType ? p.set("vehicleType", vehicleType) : p.delete("vehicleType");
      dateRange?.from
        ? p.set("pickupDate", dateRange.from.toISOString())
        : p.delete("pickupDate");
      dateRange?.to
        ? p.set("dropoffDate", dateRange.to.toISOString())
        : p.delete("dropoffDate");
      p.delete("page");
      return `/search?${p.toString()}`;
    },
    [location, vehicleType, dateRange],
  );

  return (
    <SearchDraftContext.Provider
      value={{
        location,
        setLocation,
        vehicleType,
        setVehicleType,
        dateRange,
        handleDate,
        reset,
        buildUrl,
      }}
    >
      {children}
    </SearchDraftContext.Provider>
  );
}

export function useSearchDraft() {
  const ctx = useContext(SearchDraftContext);
  if (!ctx)
    throw new Error("useSearchDraft must be used inside SearchDraftProvider");
  return ctx;
}
