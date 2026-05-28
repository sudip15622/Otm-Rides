"use client";
import { useEffect, useState } from "react";
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
  saveStep1Schema,
  VehicleType,
} from "@/schemas/become-a-host";
import { Check, ChevronDown, Plus } from "lucide-react";
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

const COLOR_PRESETS = [
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
];

export function Step1Form({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerGetFormData, setIsFormValid } = useStepForm();
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 26;
  const [selectedBrandId, setSelectedBrandId] = useState(
    draft.model?.brandId ?? "",
  );

  useStepGuard(1);

  const form = useForm<SaveStep1FormData>({
    resolver: zodResolver(saveStep1Schema),
    defaultValues: {
      type: draft.type ?? undefined,
      modelId: draft.modelId ?? undefined,
      customBrand: draft.customBrand ?? undefined,
      customModel: draft.customModel ?? undefined,
      year: draft.year ?? minYear,
      color: draft.color ?? undefined,
      plateNumber: draft.plateNumber ?? undefined,
    },
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  // Register form getter for Save & Exit
  useEffect(() => {
    registerGetFormData(() => form.getValues());
  }, [form, registerGetFormData]);

  // Keep shell buttons in sync with current form validity
  useEffect(() => {
    setIsFormValid(form.formState.isValid);
  }, [form.formState.isValid, setIsFormValid]);

  // Brands & Models
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: queryKeys.brands(),
    queryFn: getBrands,
  });

  const { data: models = [] } = useQuery<VehicleModel[]>({
    queryKey: queryKeys.models(selectedBrandId),
    queryFn: () => getModelsByBrand(selectedBrandId),
    enabled: !!selectedBrandId,
  });

  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId);
  const selectedYear = form.watch("year") ?? minYear;

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: SaveStep1FormData) => saveStepApi(vehicleId, 1, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      router.push(`/become-a-host/${vehicleId}/step/2`);
    },
  });

  async function handleContinue() {
    const valid = await form.trigger();
    if (!valid) return;
    saveMutation.mutate(form.getValues());
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="font-bold text-3xl">Tell us about your vehicle</h1>

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
          <div className="flex flex-col gap-4">
            <div className="flex gap-5 items-start">
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
                      {selectedBrand?.name ?? "Select brand"}
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
                            const isSelected = brand.id === selectedBrandId;

                            return (
                              <CommandItem
                                key={brand.id}
                                value={brand.name}
                                onSelect={() => {
                                  setSelectedBrandId(brand.id);
                                  form.setValue("modelId", undefined, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                  setBrandOpen(false);
                                  setModelOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "size-4",
                                    isSelected ? "opacity-100" : "opacity-0",
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
              </div>
              <Controller
                name="modelId"
                control={form.control}
                render={({ field, fieldState }) => (
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
                  </div>
                )}
              />
            </div>
            {form.formState.errors.modelId && (
              <p className="text-destructive text-xs">
                {form.formState.errors.modelId.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Label>Manufacuturing year</Label>
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
                    <p className="text-destructive text-xs mt-1">
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
            <Label htmlFor="vehicle-color">Color</Label>

            <Controller
              name="color"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex items-center gap-4">
                    <Input
                      value={field.value ?? ""}
                      onChange={(event) => field.onChange(event.target.value)}
                      placeholder="#000000"
                      className="h-12 flex-1 rounded-2xl px-4"
                    />
                    <div className="flex flex-1 items-center justify-start gap-2">
                      {COLOR_PRESETS.map((item) => {
                        const { value } = item;
                        const isSelected = value === field.value;
                        return (
                          <div
                            key={value}
                            onClick={() => field.onChange(value)}
                            className={cn(
                              "w-8 h-8 rounded-full cursor-pointer border border-border/50 shadow-sm",
                              isSelected ? "ring-2 ring-secondary" : "",
                            )}
                            style={{ background: value }}
                          />
                        );
                      })}
                      <label
                        htmlFor="vehicle-color"
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-card shadow-sm"
                      >
                        <Plus className="size-4" />
                        <input
                          id="vehicle-color"
                          type="color"
                          value={field.value ?? "#000000"}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>
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

          <div className="flex flex-col gap-4">
            <Label htmlFor="vehicle-color">Registration Number</Label>
            <Controller
              name="plateNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder="e.g., Ba 2 Pa 2024"
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
      </div>
      <StepFooter
        vehicleId={vehicleId}
        currentStep={1}
        onContinue={handleContinue}
        isLoading={saveMutation.isPending}
        isContinueDisabled={!form.formState.isValid}
      />
    </>
  );
}
