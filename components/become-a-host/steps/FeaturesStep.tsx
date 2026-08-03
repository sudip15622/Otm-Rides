"use client";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { getFeatures, saveStep } from "@/lib/api/draft";
import { extractValidFields } from "@/lib/extractValidFields";
import { getRoute, ROUTES } from "@/lib/host/routes";
import { queryKeys } from "@/lib/query-keys";
import {
  SaveStep5Dto,
  saveStep5PartialSchema,
  saveStep5Schema,
} from "@/lib/schemas/draft";
import { Feature } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Footer from "../shell/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getFeatureIcon } from "@/lib/icons";
import { getApiError } from "@/lib/api/errors";

const ROUTE = getRoute("features");

const FeaturesStep = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  const { data: features = [], isError: featuresError } = useQuery<Feature[]>({
    queryKey: queryKeys.features(),
    queryFn: getFeatures,
  });

  const form = useForm<z.input<typeof saveStep5Schema>, any, SaveStep5Dto>({
    resolver: zodResolver(saveStep5Schema),
    defaultValues: {
      displayName: draft.displayName ?? "",
      featureIds: draft.features?.map((f) => f.featureId) ?? [],
      additionalFeatures: draft.extraFeatures ?? "",
    },
    mode: "onTouched",
  });

  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    registerSaveData(() =>
      extractValidFields(
        saveStep5PartialSchema,
        formRef.current.getValues() as Record<string, unknown>,
      ),
    );
  }, [registerSaveData]);

  const saveMutation = useMutation({
    mutationFn: (data: SaveStep5Dto) =>
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
        toast.error("Your given title is already taken.");
      } else {
        toast.error(message ?? "Failed to save. Please try again.");
      }
    },
  });

  if (isBlocked) return null;

  return (
    <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">
          Give your listing a title and highlight what it offers
        </h1>
        <p className="text-sm text-muted-foreground">
          A good title and clear features help renters trust your listing.
        </p>
      </div>

      <form className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Label htmlFor="display-name">Give a title</Label>
          <Controller
            name="displayName"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="display-name"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="e.g., My Blue Activa"
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
          <Label>
            Select features your{" "}
            {draft.type ? draft.type.toLowerCase() : "vehicle"} have
          </Label>
          <Controller
            name="featureIds"
            control={form.control}
            render={({ field, fieldState }) => {
              const selected = field.value ?? [];

              function toggleFeature(id: string) {
                if (selected.includes(id)) {
                  field.onChange(selected.filter((f) => f !== id));
                } else {
                  field.onChange([...selected, id]);
                }
              }

              return (
                <>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-4">
                    {features.map((feature) => {
                      const isSelected = selected.includes(feature.id);
                      const Icon = getFeatureIcon(feature.icon);
                      return (
                        <div
                          key={feature.id}
                          onClick={() => toggleFeature(feature.id)}
                          className={cn(
                            "flex flex-col items-center justify-center text-center gap-2 border shadow-sm xs:p-4 p-3 rounded-2xl cursor-pointer",
                            isSelected
                              ? "border-foreground bg-accent/60"
                              : "border-border/50 hover:border-foreground/40 hover:bg-background",
                          )}
                        >
                          <Icon className="size-7" />
                          <h3 className="font-medium text-sm">
                            {feature.name}
                          </h3>
                        </div>
                      );
                    })}

                    {featuresError && (
                      <p className="text-destructive text-xs">
                        Couldn't load features. Please refresh.
                      </p>
                    )}

                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                </>
              );
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Label htmlFor="additional-features">
            Anything else worth mentioning? (optional)
          </Label>

          <Controller
            name="additionalFeatures"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  id="additional-features"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="e.g., Recently serviced, comes with a phone mount and extra helmet"
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

export default FeaturesStep;
