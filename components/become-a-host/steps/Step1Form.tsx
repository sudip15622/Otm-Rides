"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDraft } from "@/contexts/draftContext";
import { useStepForm } from "@/contexts/stepFormContext";
import { useStepGuard } from "@/hooks/useStepGuard";
import {
  saveStepApi,
  getBrands,
  getModelsByBrand,
} from "@/lib/api/become-a-host";
import { StepFooter } from "@/components/become-a-host/StepFooter";
import { queryKeys } from "@/lib/query-keys";
import {
  SaveStep1FormData,
  saveStep1PartialSchema,
  saveStep1Schema,
  VehicleType,
} from "@/schemas/become-a-host";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Brand, VehicleModel } from "@/types/types";
import { Input } from "@/components/ui/input";
import StepNavbar from "../StepNavbar";
import { toast } from "sonner";

const VEHICLE_TYPES = [
  {
    title: "Bike",
    value: VehicleType.BIKE,
    description: "Motorcycles, sport bikes, cruisers",
    image: "/type_bike.png",
  },
  {
    title: "Scooter",
    value: VehicleType.SCOOTER,
    description: "Automatic scooters, mopeds",
    image: "/type_scooter.png",
  },
];

export function Step1Form({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerGetSaveData } = useStepForm();
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 26;

  // FIX #4: useStepGuard now returns isBlocked.
  // Rendering null while redirect is pending eliminates the flash.
  const { isBlocked } = useStepGuard(1);

  const form = useForm<SaveStep1FormData>({
    resolver: zodResolver(saveStep1Schema),
    defaultValues: {
      type: draft.type ?? undefined,
      brandId: draft.brandId ?? undefined,
      modelId: draft.modelId ?? undefined,
      year: draft.year ?? minYear,
      plateNumber: draft.plateNumber ?? undefined,
    },
    // FIX #8: "onTouched" so errors only show after a field is touched,
    // but isValid reflects the true state from the initial defaultValues.
    // This means Continue is enabled when draft data is already valid.
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  // FIX #5: Use a ref to hold the form instance so the registered closure
  // always reads the latest getValues() without going stale.
  // `form` from useForm() is stable, but being explicit avoids future issues
  // if the form is ever recreated.
  const formRef = useRef(form);
  formRef.current = form;

  // Register getSaveData — runs once on mount.
  // Uses formRef.current so it always sees the latest form state.
  useEffect(() => {
    registerGetSaveData(() => {
      const values = formRef.current.getValues();

      // Try full partial parse first (fast path — all fields valid)
      const fullResult = saveStep1PartialSchema.safeParse(values);
      if (fullResult.success) {
        // Return null if every field is empty/undefined (nothing worth saving)
        const hasAnyValue = Object.values(fullResult.data).some(
          (v) => v !== undefined && v !== "" && v !== null,
        );
        return hasAnyValue ? fullResult.data : null;
      }

      // Slow path — strip field by field, keep only individually valid values
      const safe: Record<string, any> = {};
      for (const [key, fieldSchema] of Object.entries(
        saveStep1PartialSchema.shape,
      )) {
        const val = (values as Record<string, any>)[key];
        if (
          val !== undefined &&
          val !== "" &&
          val !== null &&
          (fieldSchema as any).safeParse(val).success
        ) {
          safe[key] = val;
        }
      }

      return Object.keys(safe).length > 0 ? safe : null;
    });
  }, [registerGetSaveData]); // stable ref — runs once

  // Brands & Models
  const { data: brands = [], isError: brandsError } = useQuery<Brand[]>({
    queryKey: queryKeys.brands(),
    queryFn: getBrands,
  });

  const selectedBrandId = form.watch("brandId") ?? "";

  const { data: models = [] } = useQuery<VehicleModel[]>({
    queryKey: queryKeys.models(selectedBrandId),
    queryFn: () => getModelsByBrand(selectedBrandId),
    enabled: !!selectedBrandId,
  });

  const selectedYear = form.watch("year") ?? minYear;

  // Save mutation — isLoading passed directly to StepFooter (FIX #6)
  const saveMutation = useMutation({
    mutationFn: (data: SaveStep1FormData) => saveStepApi(vehicleId, 1, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      router.push(`/become-a-host/${vehicleId}/steps/2`);
    },
    onError: () => {
      toast.error("Failed to save. Please try again.");
    },
  });

  async function handleContinue() {
    const valid = await form.trigger();
    if (!valid) return;
    saveMutation.mutate(form.getValues());
  }

  // FIX #4: Render nothing while guard redirect is in flight
  if (isBlocked) return null;

  return (
    <>
      <StepNavbar currentStep={1} vehicleId={vehicleId} />
      <main className="flex flex-col gap-8 w-full max-w-2xl mx-auto pt-24 pb-34">
        <h1 className="font-bold text-3xl">Tell us about your vehicle</h1>

        {/* FIX #11: Show error if brands failed to load */}
        {brandsError && (
          <p className="text-destructive text-sm">
            Failed to load brands. Please refresh the page.
          </p>
        )}

        <form action="#" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Label>Vehicle type</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-5">
                    {VEHICLE_TYPES.map((vehicleType) => {
                      const { title, value, description, image } = vehicleType;
                      const isSelected = field.value === value;
                      return (
                        <div
                          key={value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-col flex-1 border shadow-sm items-center justify-center gap-y-2 p-6 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <div className="relative w-auto h-auto">
                            <Image
                              src={image}
                              alt={title}
                              width={40}
                              height={40}
                              priority
                              loading="eager"
                              className="w-auto h-auto object-cover"
                            />
                          </div>
                          <div className="flex flex-col text-center">
                            <h3 className="font-bold text-sm">{title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex gap-5 items-start">
            <Controller
              name="brandId"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-col gap-4 flex-1">
                    <Label>Brand</Label>
                    <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={brandOpen}
                            className="h-12 w-full bg-card hover:bg-accent/50 cursor-pointer justify-between rounded-2xl px-4"
                          />
                        }
                      >
                        <span className="truncate text-left">
                          {brands.find((m) => m.id === field.value)?.name ??
                            "Select brand"}
                        </span>
                        <ChevronDown className="size-4 opacity-60" />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Search brands..." />
                          <CommandList>
                            <CommandEmpty>No brand found.</CommandEmpty>
                            <CommandGroup>
                              {brands.map((brand) => {
                                const isSelected = brand.id === field.value;
                                return (
                                  <CommandItem
                                    key={brand.id}
                                    value={brand.name}
                                    onSelect={() => {
                                      field.onChange(brand.id);
                                      form.setValue(
                                        "modelId",
                                        undefined as never,
                                        {
                                          shouldDirty: true,
                                          shouldValidate: true,
                                        },
                                      );
                                      setBrandOpen(false);
                                      setModelOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "size-4",
                                        isSelected
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <span>{brand.name}</span>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            />

            <Controller
              name="modelId"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-col gap-4 flex-1">
                    <Label>Model</Label>
                    <Popover open={modelOpen} onOpenChange={setModelOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={modelOpen}
                            disabled={!selectedBrandId}
                            className="w-full h-12 px-4 cursor-pointer justify-between rounded-2xl bg-card hover:bg-accent/50"
                          />
                        }
                        className="w-full"
                      >
                        <span className="truncate text-left">
                          {models.find((m) => m.id === field.value)?.name ??
                            (selectedBrandId
                              ? "Select model"
                              : "Select brand first")}
                        </span>
                        <ChevronDown className="size-4 opacity-60" />
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Search models..." />
                          <CommandList>
                            <CommandEmpty>No model found.</CommandEmpty>
                            <CommandGroup>
                              {models.map((model) => {
                                const isSelected = model.id === field.value;
                                return (
                                  <CommandItem
                                    key={model.id}
                                    value={model.name}
                                    onSelect={() => {
                                      field.onChange(model.id);
                                      setModelOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "size-4",
                                        isSelected
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <span>{model.name}</span>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Label>Manufacturing year</Label>
              <span className="text-base font-bold">{selectedYear}</span>
            </div>
            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Slider
                    min={minYear}
                    max={currentYear}
                    step={1}
                    value={field.value ?? minYear}
                    onValueChange={(value) => {
                      field.onChange(value as number);
                    }}
                    className="w-full"
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
            <div className="flex mt-2 items-center justify-between gap-5 text-muted-foreground text-xs">
              <span>{minYear}</span>
              <span>{currentYear}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="plate-number">Registration Number</Label>
            <Controller
              name="plateNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="plate-number"
                    value={field.value ?? ""}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                    placeholder="e.g., BA 2 PA 1234"
                    className="h-12 rounded-2xl px-4"
                  />
                  {fieldState.error && (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </main>

      <StepFooter
        vehicleId={vehicleId}
        currentStep={1}
        onContinue={handleContinue}
        // FIX #6: Pass mutation isPending directly — no local state wrapper
        isLoading={saveMutation.isPending}
        // FIX #8: isValid is computed from defaultValues (seeded from draft),
        // so this is enabled if the draft data is already complete.
        // With mode:"onTouched", errors only appear after fields are touched.
        isContinueDisabled={!form.formState.isValid}
      />
    </>
  );
}
