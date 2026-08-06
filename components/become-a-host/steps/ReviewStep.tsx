"use client";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { submitDraft } from "@/lib/api/draft";
import { getApiError } from "@/lib/api/errors";
import { getRoute, ROUTES } from "@/lib/host/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import Footer from "../shell/Footer";
import { queryKeys } from "@/lib/query-keys";

const ROUTE = getRoute("review");

function stepSlug(stepNumber: number) {
  return ROUTES.find((r) => r.stepNumber === stepNumber)?.slug ?? "overview";
}

function SectionHeader({
  title,
  editSlug,
  vehicleId,
}: {
  title: string;
  editSlug: string;
  vehicleId: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-bold text-lg">{title}</h2>
      <Link
        href={`/become-a-host/${vehicleId}/${editSlug}`}
        className="flex items-center gap-1 text-sm text-secondary hover:underline"
      >
        <Pencil className="size-3.5" />
        Edit
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

const ReviewStep = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();

  useEffect(() => {
    // Review has nothing to partial-save
    registerSaveData(() => null);
  }, [registerSaveData]);

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: () => submitDraft(vehicleId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.draft(vehicleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.listingDrafts });
      router.replace(`/become-a-host/submitted/${vehicleId}`);
    },
    onError: (error) => {
      const { status, message } = getApiError(error);

      if (status === 400 && axios.isAxiosError(error)) {
        const incompleteSteps: number[] | undefined =
          error.response?.data?.incompleteSteps;

        if (incompleteSteps?.length) {
          const firstSlug = stepSlug(Math.min(...incompleteSteps));
          toast.error("Some steps are incomplete. Redirecting you there now.");
          router.push(`/become-a-host/${vehicleId}/${firstSlug}`);
          return;
        }
      }

      toast.error(message ?? "Failed to submit. Please try again.");
    },
  });

  if (isBlocked) return null;

  return (
    <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Review your listing</h1>
        <p className="text-sm text-muted-foreground">
          Double check everything looks right before you submit.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Vehicle"
          editSlug="basic-info"
          vehicleId={vehicleId}
        />
        <Row label="Type" value={draft.type} />
        <Row
          label="Brand & Model"
          value={
            draft.brandName && draft.modelName
              ? `${draft.brandName} ${draft.modelName}`
              : null
          }
        />
        <Row label="Year" value={draft.year} />
        <Row label="Plate Number" value={draft.plateNumber} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Specifications"
          editSlug="specifications"
          vehicleId={vehicleId}
        />
        <Row label="Transmission" value={draft.transmission} />
        <Row label="Fuel Type" value={draft.fuelType} />
        <Row label="Condition" value={draft.condition} />
        {draft.mileage != null && (
          <Row label="Mileage" value={`${draft.mileage} km/l`} />
        )}
        {draft.odometer != null && (
          <Row label="Odometer" value={`${draft.odometer} km`} />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Location"
          editSlug="location"
          vehicleId={vehicleId}
        />
        <Row label="Street Address" value={draft.location?.address} />
        <Row label="City" value={draft.location?.city} />
        <Row label="District" value={draft.location?.district} />
        <Row label="Province" value={draft.location?.province} />
        <Row label="Country" value={draft.location?.country} />
        <Row label="Latitude" value={draft.location?.latitude} />
        <Row label="Longitude" value={draft.location?.longitude} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="Photos" editSlug="photos" vehicleId={vehicleId} />
        <div className="grid grid-cols-4 gap-2">
          {draft.images?.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative aspect-3/2 rounded-xl overflow-hidden border border-border/50"
            >
              <Image
                src={img.url}
                alt="Vehicle"
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Features"
          editSlug="features"
          vehicleId={vehicleId}
        />
        <Row label="Title" value={draft.displayName} />
        <div className="flex flex-wrap gap-2 pt-2">
          {draft.features
            ?.filter((f) => f.feature)
            .map((f) => (
              <span
                key={f.featureId}
                className="text-xs px-3 py-1.5 rounded-full bg-accent/60"
              >
                {f.feature.name}
              </span>
            ))}
        </div>
        {draft.extraFeatures && (
          <p className="text-sm text-muted-foreground pt-2">
            {draft.extraFeatures}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Pricing & Policies"
          editSlug="pricing"
          vehicleId={vehicleId}
        />
        <Row
          label="Price per day"
          value={draft.pricePerDay ? `NPR ${draft.pricePerDay}` : null}
        />
        <Row label="Security Deposit" value={`NPR ${draft.securityDeposit}`} />
        <Row label="Cancellation Policy" value={draft.cancellationPolicy} />
        <Row label="Fuel Policy" value={draft.fuelPolicy} />
        <Row
          label="Outstation Trips"
          value={draft.allowOutstation ? "Allowed" : "Not allowed"}
        />
        {draft.usageNotes && (
          <p className="text-sm text-muted-foreground pt-2">
            {draft.usageNotes}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-accent/30 p-4 text-sm text-muted-foreground">
        Submitting creates your listing, but it won't go live yet — you'll need
        to upload verification documents from your dashboard before renters can
        book it.
      </div>

      <Footer
        vehicleId={vehicleId}
        isLoading={submitMutation.isPending}
        isContinueDisabled={false}
        onContinue={() => submitMutation.mutate()}
      />
    </div>
  );
};

export default ReviewStep;
