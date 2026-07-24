"use client";
import { Input } from "@/components/ui/input";
import { APIProvider, Map, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin, Search, X } from "lucide-react";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SaveStep3Dto,
  saveStep3PartialSchema,
  saveStep3Schema,
} from "@/lib/schemas/draft";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { getRoute, ROUTES } from "@/lib/host/routes";
import { extractValidFields } from "@/lib/extractValidFields";
import { useMutation } from "@tanstack/react-query";
import { saveStep } from "@/lib/api/draft";
import { toast } from "sonner";
import Footer from "../shell/Footer";
import { MdMyLocation } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const DEFAULT_CENTER = { lat: 27.6688, lng: 84.4381 }; // Bharatpur
const ROUTE = getRoute("location");

type Suggestion = {
  placeId: string;
  text: string;
};

type AddressFields = {
  address: string;
  city: string;
  district: string;
  province: string;
  lat: number;
  lng: number;
};

function getComponent(
  components: google.maps.places.AddressComponent[],
  type: string,
): string {
  return components.find((c) => c.types.includes(type))?.longText ?? "";
}

function SearchInput({ onSelect }: { onSelect: (placeId: string) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const placesLib = useMapsLibrary("places");

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
  }, [placesLib]);

  async function handleChange(value: string) {
    setQuery(value);

    if (!placesLib || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const { suggestions: results } =
      await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: value,
        includedRegionCodes: ["np"],
        sessionToken: sessionTokenRef.current ?? undefined,
      });

    setSuggestions(
      results.map((r: any) => ({
        placeId: r.placePrediction!.placeId,
        text: r.placePrediction!.text.toString(),
      })),
    );
    setIsOpen(true);
  }

  function handleSelect(suggestion: Suggestion) {
    setQuery(suggestion.text);
    setIsOpen(false);
    setSuggestions([]);
    onSelect(suggestion.placeId);

    if (placesLib) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }
  }

  return (
    <div className="relative w-full flex flex-col gap-2">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder="Search for your location"
          className="w-full h-12 pl-10 pr-4 rounded-2xl"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="w-full bg-card border border-border/50 rounded-2xl shadow-md overflow-hidden z-20">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(s)}
              className="w-full flex items-stretch gap-2 text-left px-4 py-3 text-sm hover:bg-accent/60 cursor-pointer"
            >
              <span className="p-1.5 sm:p-2 rounded-md bg-accent flex items-center justify-center">
                <FaLocationDot className="size-4 sm:size-5" />
              </span>
              <span className="flex items-center">{s.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SubStep1Search({
  onSelect,
  showContinue,
  onContinueClick,
}: {
  onSelect: (placeId: string) => void;
  showContinue: boolean;
  onContinueClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Where is your vehicle located?</h1>
        <p className="text-sm text-muted-foreground">
          We only share your address after tenants book. Until then, they'll see
          an approximate location.
        </p>
      </div>
      <SearchInput onSelect={onSelect} />
      {showContinue && (
        <button
          type="button"
          onClick={onContinueClick}
          className="w-fit text-sm text-secondary underline cursor-pointer"
        >
          Continue with your previously selected location
        </button>
      )}
    </div>
  );
}

function ConfirmAddressPopup({
  placeId,
  onBack,
  onConfirm,
}: {
  placeId: string;
  onBack: () => void;
  onConfirm: (data: SaveStep3Dto) => void;
}) {
  const placesLib = useMapsLibrary("places");
  const [loading, setLoading] = useState(true);

  const form = useForm<SaveStep3Dto>({
    resolver: zodResolver(saveStep3Schema),
    defaultValues: {
      address: "",
      city: "",
      district: "",
      province: "",
      country: "Nepal",
      latitude: undefined,
      longitude: undefined,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function fetchDetails() {
      setLoading(true);
      const place = new placesLib!.Place({ id: placeId });
      await place.fetchFields({ fields: ["addressComponents", "location"] });
      if (cancelled) return;

      const components = place.addressComponents ?? [];
      const lat = place.location?.lat();
      const lng = place.location?.lng();

      const locality = getComponent(components, "locality");
      const level3 = getComponent(components, "administrative_area_level_3");
      const level2 = getComponent(components, "administrative_area_level_2");
      const level1 = getComponent(components, "administrative_area_level_1");
      const sublocal = getComponent(components, "sublocality_level_1");
      const route = getComponent(components, "route");
      const premise = getComponent(components, "premise");

      const address =
        [premise, sublocal, route].filter(Boolean).join(", ") || locality;

      form.reset({
        address,
        city: locality || level3,
        district: level2,
        province: level1,
        country: "Nepal",
        latitude: lat,
        longitude: lng,
      });
      setLoading(false);
    }

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [placesLib, placeId, form]);

  const handleConfirm = form.handleSubmit((data) => onConfirm(data));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 inset-0 z-1000 bg-black/50 flex sm:items-center items-end mt-auto justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative bg-card sm:rounded-4xl rounded-t-4xl w-full max-w-full sm:max-w-lg sm:px-8 px-4 py-6 flex flex-col gap-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onBack}
          className="absolute cursor-pointer top-2 right-2 w-fit hover:bg-accent/50 rounded-full p-2"
        >
          <RxCross2 className="size-5" />
        </button>
        <h2 className="font-bold text-lg leading-tight text-center w-3/4 sm:w-full mx-auto">
          Confirm your address
        </h2>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading address details...
          </div>
        ) : (
          <form className="flex flex-col gap-4">
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Street address or Tole</Label>
                  <Input {...field} className="h-11 rounded-xl" />
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <div className="grid gap-3 grid-cols-1 xs:grid-cols-2">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>City</Label>
                    <Input {...field} className="h-11 rounded-xl" />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="district"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>District</Label>
                    <Input {...field} className="h-11 rounded-xl" />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <Controller
              name="province"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Province</Label>
                  <Input {...field} className="h-11 rounded-xl" />
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </form>
        )}

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="py-2.5 px-4 font-medium rounded-xl hover:bg-accent/50 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="py-2.5 px-6 font-medium rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 text-sm cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const LocationStep = ({ vehicleId }: { vehicleId: string }) => {
  return (
    <APIProvider apiKey={API_KEY}>
      <LocationFormInner vehicleId={vehicleId} />
    </APIProvider>
  );
};

const LocationFormInner = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  const hasSavedLocation = !!draft.location?.latitude;
  const [subStep, setSubStep] = useState<1 | 2 | 3>(hasSavedLocation ? 3 : 1);

  const [pendingPlaceId, setPendingPlaceId] = useState<string | null>(null);

  const [confirmedAddress, setConfirmedAddress] = useState<SaveStep3Dto>({
    address: draft.location?.address ?? "",
    city: draft.location?.city ?? "",
    district: draft.location?.district ?? "",
    province: draft.location?.province ?? "",
    country: draft.location?.country ?? "Nepal",
    latitude: draft.location?.latitude
      ? Number(draft.location.latitude)
      : undefined,
    longitude: draft.location?.longitude
      ? Number(draft.location.longitude)
      : undefined,
  });

  const [mapCenter, setMapCenter] = useState(
    hasSavedLocation
      ? {
          lat: Number(draft.location!.latitude),
          lng: Number(draft.location!.longitude),
        }
      : DEFAULT_CENTER,
  );

  const hasConfirmedLocation = Boolean(
    confirmedAddress.address &&
    confirmedAddress.city &&
    confirmedAddress.district &&
    confirmedAddress.province &&
    confirmedAddress.latitude !== undefined &&
    confirmedAddress.longitude !== undefined,
  );

  const stateRef = useRef({ confirmedAddress, mapCenter, subStep });
  stateRef.current = { confirmedAddress, mapCenter, subStep };

  useEffect(() => {
    registerSaveData(() => {
      const {
        confirmedAddress: addr,
        mapCenter: center,
        subStep: step,
      } = stateRef.current;
      // Only include lat/lng if the user has actually reached the map step —
      // otherwise we'd save a default center the user never confirmed.
      const data = {
        ...addr,
        latitude: step === 3 ? center.lat : addr.latitude,
        longitude: step === 3 ? center.lng : addr.longitude,
      };
      return extractValidFields(
        saveStep3PartialSchema,
        data as Record<string, unknown>,
      );
    });
  }, [registerSaveData]);

  const saveMutation = useMutation({
    mutationFn: (data: SaveStep3Dto) =>
      saveStep(vehicleId, ROUTE.stepNumber!, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      const nextIndex = ROUTES.findIndex((r) => r.slug === ROUTE.slug) + 1;
      router.push(`/become-a-host/${vehicleId}/${ROUTES[nextIndex].slug}`);
    },
    onError: () => toast.error("Failed to save. Please try again."),
  });

  if (isBlocked) return null;

  return (
    <div className="w-full mx-auto max-w-xl pb-32 flex flex-col gap-8">
      {subStep === 1 && (
        <SubStep1Search
          onSelect={setPendingPlaceId}
          showContinue={hasConfirmedLocation}
          onContinueClick={() => setSubStep(3)}
        />
      )}

      {subStep === 3 && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl">Pin your exact location</h1>
            <p className="text-sm text-muted-foreground">
              Drag the map so the pin marks your vehicle's exact spot.
            </p>
          </div>
          <div className="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-2 px-4 py-3 rounded-2xl border border-border bg-background">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <p className="text-sm flex items-center">
                {[
                  confirmedAddress.address,
                  confirmedAddress.city,
                  confirmedAddress.district,
                  confirmedAddress.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            {/* Lets user redo the search if the address is wrong,
                even when resuming an already-saved location */}
            <button
              type="button"
              onClick={() => setSubStep(1)}
              className="w-fit sm:text-xs text-sm text-secondary underline shrink-0 cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-border xs:aspect-square h-80 xs:h-auto w-full">
            <Map
              defaultCenter={mapCenter}
              defaultZoom={16}
              mapId="DEMO_MAP_ID"
              disableDefaultUI
              gestureHandling="greedy"
              zoomControl={true}
              // fullscreenControl={true}
              onCenterChanged={(e) =>
                setMapCenter({
                  lat: e.detail.center.lat,
                  lng: e.detail.center.lng,
                })
              }
            />
            <MdMyLocation className="absolute inset-0 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-7 sm:size-8" />
          </div>
          <p className="text-muted-foreground text-xs -mt-4">
            Note: Ensure the pin is in right place before moving to next step.
          </p>
        </div>
      )}

      <AnimatePresence>
        {pendingPlaceId && (
          <ConfirmAddressPopup
            placeId={pendingPlaceId}
            onBack={() => setPendingPlaceId(null)}
            onConfirm={(data) => {
              setConfirmedAddress(data);
              setMapCenter({
                lat: data.latitude ?? DEFAULT_CENTER.lat,
                lng: data.longitude ?? DEFAULT_CENTER.lng,
              });
              setPendingPlaceId(null);
              setSubStep(3);
            }}
          />
        )}
      </AnimatePresence>

      <Footer
        vehicleId={vehicleId}
        isLoading={saveMutation.isPending}
        isContinueDisabled={false}
        onBack={subStep === 3 ? () => setSubStep(1) : undefined}
        onContinue={() => {
          if (subStep !== 3) {
            if (hasConfirmedLocation) {
              setSubStep(3);
              return;
            }
            toast.info("Please select your location first");
            return;
          }
          saveMutation.mutate({
            ...confirmedAddress,
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
          });
        }}
      />
    </div>
  );
};

export default LocationStep;
