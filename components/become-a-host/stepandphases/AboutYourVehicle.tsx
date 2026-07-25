"use client";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AboutYourVehicle = ({ vehicleId }: { vehicleId: string }) => {
  const { isBlocked } = useRouteGuard();
  if (isBlocked) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-12 w-full mx-auto max-w-5xl md:pt-8 pt-4 pb-32">
      <div className="flex flex-col gap-4 order-2 md:order-1">
        <div className="font-medium md:text-lg text-base">Phase 1</div>
        <h1 className="md:text-4xl text-3xl font-semibold mb-2">
          Tell us about your vehicle
        </h1>
        <p className="md:text-lg text-base">
          In this phase, we'll ask you which type of vehicle you have and what's
          the brand details as well as it's specifications. Then let us know the
          location where it's parked.
        </p>
      </div>

      <div className="order-1 md:order-2 relative w-auto h-auto shrink mx-auto md:mx-0 md:ml-auto overflow-hidden border-r border-b border-secondary">
        <Image
          src="/about_your_vehicle_hero1.png"
          alt="phase-1-hero"
          width={400}
          height={400}
          priority
          loading="eager"
          className="object-cover h-auto w-auto"
        />
      </div>
      <div className="fixed z-50 left-0 bottom-0 bg-card border-t-4 border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
        <Link
          href={`/become-a-host/${vehicleId}/overview`}
          className="py-3 px-4 font-medium rounded-xl hover:bg-accent/50"
        >
          Back
        </Link>
        <Link
          href={`/become-a-host/${vehicleId}/basic-info`}
          className="py-3 px-8 flex items-center justify-center gap-2 sm:text-base text-sm font-medium rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200 ease-in-out"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default AboutYourVehicle;
