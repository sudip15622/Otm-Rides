"use client";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import {
  SaveStep1Dto,
  saveStep1PartialSchema,
  saveStep1Schema,
  VehicleType,
} from "@/lib/schemas/draft";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractValidFields } from "@/lib/extractValidFields";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getBrands, getModelsByBrand, saveStep } from "@/lib/api/draft";
import { ROUTES, getRoute } from "@/lib/host/routes";
import { toast } from "sonner";
import Footer from "../shell/Footer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Brand, VehicleModel } from "@/types/types";
import { queryKeys } from "@/lib/query-keys";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { getApiError } from "@/lib/api/errors";

const ROUTE = getRoute("basic-info");

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

const BasicInfoForm = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 16;

  const form = useForm<SaveStep1Dto>({
    resolver: zodResolver(saveStep1Schema),
    defaultValues: {
      type: draft.type ?? undefined,
      brandId: draft.brandId ?? undefined,
      modelId: draft.modelId ?? undefined,
      year: draft.year ?? minYear,
      plateNumber: draft.plateNumber ?? "",
    },
    mode: "onTouched",
  });

  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    registerSaveData(() =>
      extractValidFields(
        saveStep1PartialSchema,
        formRef.current.getValues() as Record<string, unknown>,
      ),
    );
  }, [registerSaveData]);

  //brands and models
  const { data: brands = [], isError: brandsError } = useQuery<Brand[]>({
    queryKey: queryKeys.brands(),
    queryFn: getBrands,
  });

  const selectedYear = form.watch("year") ?? minYear;
  const selectedBrandId = form.watch("brandId") ?? "";

  const { data: models = [], isError: modelsError } = useQuery<VehicleModel[]>({
    queryKey: queryKeys.models(selectedBrandId),
    queryFn: () => getModelsByBrand(selectedBrandId),
    enabled: !!selectedBrandId,
  });

  const saveMutation = useMutation({
    mutationFn: (data: SaveStep1Dto) =>
      saveStep(vehicleId, ROUTE.stepNumber!, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      const nextIndex = ROUTES.findIndex((r) => r.slug === ROUTE.slug) + 1;
      const nextSlug = ROUTES[nextIndex].slug;
      router.push(`/become-a-host/${vehicleId}/${nextSlug}`);
    },
    onError: (error) => {
      const { status, message } = getApiError(error);
      if (status === 409) {
        toast.error("Please verify the details and try again.");
      } else {
        toast.error(message ?? "Failed to save. Please try again.");
      }
    },
  });

  if (isBlocked) return null;

  return (
    <>
      <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">
            Provide vehicles basic information
          </h1>
          <p className="text-sm text-muted-foreground">
            Tell us either you are listing bike or scooter as well as provide
            brand details.
          </p>
        </div>
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Label>Select vehicle type</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="grid gap-5 grid-cols-1 xs:grid-cols-2">
                    {VEHICLE_TYPES.map((vehicleType) => {
                      const { title, value, description, image } = vehicleType;
                      const isSelected = field.value === value;
                      return (
                        <div
                          key={value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-row xs:flex-col border shadow-sm items-center xs:justify-center gap-y-2 xs:p-4 p-2 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <div className="relative w-auto h-auto gap-4">
                            <Image
                              src={image}
                              alt={title}
                              width={56}
                              height={56}
                              priority
                              loading="eager"
                              className="w-auto h-auto object-cover"
                            />
                          </div>
                          <div className="flex flex-col xs:text-center">
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

          <div className="grid gap-5 grid-cols-1 xs:grid-cols-2">
            <Controller
              name="brandId"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-col gap-4">
                    <Label>Brand</Label>
                    <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={brandOpen}
                            className="h-12 w-full bg-accent border border-secondary/50 cursor-pointer justify-between rounded-2xl px-4"
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
                        <Command className="w-full">
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
                                        // {
                                        //   shouldDirty: true,
                                        //   shouldValidate: true,
                                        // },
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
                  <div className="flex flex-col gap-4">
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
                            className="w-full h-12 px-4 cursor-pointer justify-between rounded-2xl bg-accent border border-secondary/50 "
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
                    onChange={field.onChange}
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
        <Footer
          vehicleId={vehicleId}
          isLoading={saveMutation.isPending}
          isContinueDisabled={!form.formState.isValid}
          onContinue={form.handleSubmit((data) => saveMutation.mutate(data))}
        />
      </div>
    </>
  );
};

export default BasicInfoForm;
