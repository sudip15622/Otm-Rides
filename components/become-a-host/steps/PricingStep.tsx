"use client";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { saveStep } from "@/lib/api/draft";
import { extractValidFields } from "@/lib/extractValidFields";
import { getRoute, ROUTES } from "@/lib/host/routes";
import {
  CancellationPolicy,
  FuelPolicy,
  LateReturnPolicy,
  SaveStep6Dto,
  saveStep6PartialSchema,
  saveStep6Schema,
} from "@/lib/schemas/draft";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Footer from "../shell/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Undo2,
  ShieldAlert,
  ShieldX,
  Fuel,
  Droplet,
  Gift,
  Clock,
  CalendarClock,
  Timer,
  Ban,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ROUTE = getRoute("pricing");

const CANCELLATION_OPTIONS = [
  {
    title: "Flexible",
    description: "Full refund up to 24h before",
    value: CancellationPolicy.FLEXIBLE,
    icon: Undo2,
  },
  {
    title: "Moderate",
    description: "Partial refund up to 3 days before",
    value: CancellationPolicy.MODERATE,
    icon: ShieldAlert,
  },
  {
    title: "Strict",
    description: "Limited refund window",
    value: CancellationPolicy.STRICT,
    icon: ShieldX,
  },
  {
    title: "No Refund",
    description: "Non-refundable once booked",
    value: CancellationPolicy.NO_REFUND,
    icon: Ban,
  },
];

const FUEL_POLICY_OPTIONS = [
  {
    title: "Full to Full",
    description: "Return with a full tank",
    value: FuelPolicy.FULL_TO_FULL,
    icon: Fuel,
  },
  {
    title: "Same Level",
    description: "Return at pickup fuel level",
    value: FuelPolicy.SAME_LEVEL,
    icon: Droplet,
  },
  {
    title: "Free",
    description: "Fuel included, no return requirement",
    value: FuelPolicy.FREE,
    icon: Gift,
  },
];

const LATE_RETURN_OPTIONS = [
  {
    title: "Per Hour",
    description: "Charge for every hour late",
    value: LateReturnPolicy.PER_HOUR,
    icon: Clock,
  },
  {
    title: "Per Day",
    description: "Charge a full day rate if late",
    value: LateReturnPolicy.PER_DAY,
    icon: CalendarClock,
  },
  {
    title: "Grace Only",
    description: "Buffer only, no extra charge",
    value: LateReturnPolicy.GRACE_ONLY,
    icon: Timer,
  },
  {
    title: "No Policy",
    description: "Not enforced yet",
    value: LateReturnPolicy.NO_POLICY,
    icon: Ban,
  },
];

const PricingStep = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  const form = useForm<z.input<typeof saveStep6Schema>, any, SaveStep6Dto>({
    resolver: zodResolver(saveStep6Schema),
    defaultValues: {
      pricePerDay:
        draft.pricePerDay !== null ? Number(draft.pricePerDay) : undefined,
      securityDeposit:
        draft.securityDeposit !== null
          ? Number(draft.securityDeposit)
          : undefined,
      cancellationPolicy: draft.cancellationPolicy ?? undefined,
      fuelPolicy: draft.fuelPolicy ?? undefined,
      allowOutstation: draft.allowOutstation ?? false,
      usageNotes: draft.usageNotes ?? "",
    },
    mode: "onTouched",
  });

  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    registerSaveData(() =>
      extractValidFields(
        saveStep6PartialSchema,
        formRef.current.getValues() as Record<string, unknown>,
      ),
    );
  }, [registerSaveData]);

  const saveMutation = useMutation({
    mutationFn: (data: SaveStep6Dto) =>
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
    <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Set your price and rules</h1>
        <p className="text-sm text-muted-foreground">
          Fair pricing and clear policies help you get more bookings.
        </p>
      </div>

      <form className="flex flex-col gap-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            <Label htmlFor="pricePerDay">Price per day</Label>
            <Controller
              name="pricePerDay"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="pricePerDay"
                    value={
                      Number.isNaN(field.value as number)
                        ? ""
                        : ((field.value as string | number | undefined) ?? "")
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? NaN : Number(raw));
                    }}
                    placeholder="e.g., 1000"
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
            <Label htmlFor="securityDeposit">
              Security Deposit{" "}
              <i className="text-xs text-muted-foreground">(Opt.)</i>
            </Label>
            <Controller
              name="securityDeposit"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="securityDeposit"
                    value={
                      Number.isNaN(field.value as number)
                        ? ""
                        : ((field.value as string | number | undefined) ?? "")
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? NaN : Number(raw));
                    }}
                    placeholder="e.g., 5000"
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
        <div className="text-xs text-muted-foreground -mt-4">
          <i>
            <b>Note: </b>The security deposit is collected directly by you from
            the renter at vehicle pickup and refunded after the rental if no
            damages, fines, or other applicable charges are incurred. The
            platform does not process this payment.
          </i>
        </div>

        <PolicyPicker
          label="Cancellation policy"
          name="cancellationPolicy"
          control={form.control}
          options={CANCELLATION_OPTIONS}
        />

        <PolicyPicker
          label="Fuel policy"
          name="fuelPolicy"
          control={form.control}
          options={FUEL_POLICY_OPTIONS}
        />

        <div className="flex items-center justify-between border border-border/50 rounded-2xl p-4">
          <div className="flex flex-col">
            <Label htmlFor="allowOutstation">Allow outstation trips</Label>
            <p className="text-xs text-muted-foreground">
              Let renters take the vehicle outside the city/district
            </p>
          </div>
          <Controller
            name="allowOutstation"
            control={form.control}
            render={({ field }) => (
              <Switch
                id="allowOutstation"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Label htmlFor="usage-notes">
            Any usage guides for renters?{" "}
            <i className="text-xs text-muted-foreground">(Opt.)</i>
          </Label>

          <Controller
            name="usageNotes"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  id="usage-notes"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="e.g., Must return vehicle in time, Not allowed to smoke near bike."
                  rows={4}
                  className="rounded-2xl px-4 py-3 border border-border/50 bg-background resize-none text-sm focus:outline-none focus:border-foreground/40"
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
  );
};

function PolicyPicker({
  label,
  name,
  control,
  options,
}: {
  label: string;
  name: "cancellationPolicy" | "fuelPolicy" | "lateReturnPolicy";
  control: any;
  options: { title: string; description: string; value: string; icon: any }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div
              className={cn(
                "grid gap-4",
                options.length === 3
                  ? "xs:grid-cols-3 grid-cols-2"
                  : "grid-cols-2",
              )}
            >
              {options.map((option) => {
                const { title, value, description, icon: Icon } = option;
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
  );
}

export default PricingStep;
