"use client";
import { getListingStatus } from "@/lib/api/draft";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SubmittedStep = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing-status", vehicleId],
    queryFn: () => getListingStatus(vehicleId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 text-center gap-6 max-w-md mx-auto">
      {/* {listing?.primaryImageUrl && (
        <div className="relative mx-auto w-24 h-16 rounded-xl overflow-hidden">
          <Image
            src={listing.primaryImageUrl}
            alt={listing.displayName ?? "Your vehicle"}
            width={96}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
      )} */}
      <div className="rounded-full bg-accent/60 p-4">
        <CheckCircle2 className="size-10 text-secondary" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl sm:text-3xl">
          Your listing has been created!
        </h1>
        <p className="text-sm text-muted-foreground">
          {listing?.displayName ? `"${listing.displayName}"` : "Your listing"}{" "}
          isn't live yet. Upload your vehicle's registration and insurance
          documents to get verified and start accepting bookings.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full pt-4">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/listings/${vehicleId}/verify`)}
          className="h-12 w-full rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors duration-200 ease-in-out cursor-pointer"
        >
          Upload documents now
        </button>
        <Link
          href="/"
          className="h-12 w-full flex items-center justify-center rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 transition-colors duration-200 ease-in-out"
        >
          I'll do this later
        </Link>
      </div>
    </div>
  );
};

export default SubmittedStep;
