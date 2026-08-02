"use client";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { saveStep } from "@/lib/api/draft";
import { extractValidFields } from "@/lib/extractValidFields";
import { getRoute, ROUTES } from "@/lib/host/routes";
import {
  FuelType,
  SaveStep2Dto,
  saveStep2PartialSchema,
  saveStep2Schema,
  TransmissionType,
  VehicleCondition,
} from "@/lib/schemas/draft";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Footer from "../shell/Footer";
import {
  TbManualGearbox,
  TbAutomaticGearbox,
  TbScooterElectric,
} from "react-icons/tb";
import { LuFuel } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PiSealCheckBold } from "react-icons/pi";
import { FaRegThumbsUp } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import z from "zod";

const ROUTE = getRoute("specifications");

const TRANSMISSION_TYPES = [
  {
    title: "Manual",
    description: "Full rider control",
    value: TransmissionType.MANUAL,
    icon: TbManualGearbox,
  },
  {
    title: "Automatic",
    description: "Seamless shifting",
    value: TransmissionType.AUTOMATIC,
    icon: TbAutomaticGearbox,
  },
];

const FUEL_TYPES = [
  {
    title: "Petrol",
    description: "Internal combustion",
    value: FuelType.PETROL,
    icon: LuFuel,
  },
  {
    title: "Electric",
    description: "Zero emission",
    value: FuelType.ELECTRIC,
    icon: TbScooterElectric,
  },
];
const CONDITION_TYPES = [
  {
    title: "Excellent",
    description: "Showroom condition",
    value: VehicleCondition.EXCELLENT,
    icon: PiSealCheckBold,
  },
  {
    title: "Good",
    description: "Minor wear and tear",
    value: VehicleCondition.GOOD,
    icon: FaRegThumbsUp,
  },
  {
    title: "Poor",
    description: "Requires maintenance",
    value: VehicleCondition.POOR,
    icon: BiError,
  },
];

const SpecificationForm = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  const form = useForm<z.input<typeof saveStep2Schema>, any, SaveStep2Dto>({
    resolver: zodResolver(saveStep2Schema),
    defaultValues: {
      transmission: draft.transmission ?? undefined,
      fuelType: draft.fuelType ?? undefined,
      mileage: draft.mileage ?? undefined,
      odometer: draft.odometer ?? undefined,
      condition: draft.condition ?? undefined,
    },
    mode: "onTouched",
  });

  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    registerSaveData(() =>
      extractValidFields(
        saveStep2PartialSchema,
        formRef.current.getValues() as Record<string, unknown>,
      ),
    );
  }, [registerSaveData]);

  const saveMutation = useMutation({
    mutationFn: (data: SaveStep2Dto) =>
      saveStep(vehicleId, ROUTE.stepNumber!, data),
    onSuccess: (updated) => {
      updateDraft(updated);
      const nextIndex = ROUTES.findIndex((r) => r.slug === ROUTE.slug) + 1;
      const nextSlug = ROUTES[nextIndex].slug;
      router.push(`/become-a-host/${vehicleId}/${nextSlug}`);
    },
    onError: () => toast.error("Failed to save. Please try again."),
  });

  if (isBlocked) return null;

  return (
    <>
      <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">
            Provide specs of your{" "}
            {draft.type ? draft.type.toLowerCase() : "vehicle"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Exact specification details will help you get more bookings.
          </p>
        </div>

        {/* form here  */}
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Label>Select transmission type</Label>
            <Controller
              name="transmission"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {TRANSMISSION_TYPES.map((transmissionType) => {
                      const {
                        title,
                        value,
                        description,
                        icon: Icon,
                      } = transmissionType;
                      const isSelected = field.value === value;
                      return (
                        <div
                          key={value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-col items-center text-center justify-center gap-2 border shadow-sm p-4 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <Icon className="size-6" />
                          <div className="flex flex-col">
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
            <Label>Select fuel type</Label>
            <Controller
              name="fuelType"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {FUEL_TYPES.map((fuelType) => {
                      const {
                        title,
                        value,
                        description,
                        icon: Icon,
                      } = fuelType;
                      const isSelected = field.value === value;
                      return (
                        <div
                          key={value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-col items-center text-center justify-center gap-2 border shadow-sm p-4 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <Icon className="size-6" />
                          <div className="flex flex-col">
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

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <Label htmlFor="mileage">
                Mileage - km/l{" "}
                <i className="text-xs text-muted-foreground">(Opt.)</i>
              </Label>
              <Controller
                name="mileage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="mileage"
                      value={
                        Number.isNaN(field.value as number)
                          ? ""
                          : ((field.value as string | number | undefined) ?? "")
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        field.onChange(raw === "" ? NaN : Number(raw));
                      }}
                      placeholder="e.g., 50"
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
            <div className="flex flex-col gap-4">
              <Label htmlFor="odometer">
                Odometer - km{" "}
                <i className="text-xs text-muted-foreground">(Opt.)</i>
              </Label>
              <Controller
                name="odometer"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="odometer"
                      value={
                        Number.isNaN(field.value as number)
                          ? ""
                          : ((field.value as string | number | undefined) ?? "")
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        field.onChange(raw === "" ? NaN : Number(raw));
                      }}
                      placeholder="e.g., 20000"
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
          </div>
          <div className="flex flex-col gap-4">
            <Label>Vehicle's condition</Label>
            <Controller
              name="condition"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <div className="grid xs:grid-cols-3 grid-cols-2 gap-4">
                    {CONDITION_TYPES.map((conditionType) => {
                      const {
                        title,
                        value,
                        description,
                        icon: Icon,
                      } = conditionType;
                      const isSelected = field.value === value;
                      return (
                        <div
                          key={value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-col items-center text-center justify-center gap-2 border shadow-sm p-4 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <Icon className="size-6" />
                          <div className="flex flex-col">
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

export default SpecificationForm;
