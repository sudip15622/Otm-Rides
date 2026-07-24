"use client";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PulseLoader } from "react-spinners";

const PHASES_TO_LIST = [
  {
    title: "Tell us about your vehicle",
    description:
      "Share your bike or scooter details, specs, and where it's parked.",
    image: "/bah_phase1.png",
  },
  {
    title: "Make it stand out",
    description:
      "Add photos and highlight the features that make your ride special.",
    image: "/bah_phase2.png",
  },
  {
    title: "Set your terms and go live",
    description: "Set your price, policies, upload documents and then publish.",
    image: "/bah_phase3.png",
  },
];

const Overview = ({ vehicleId }: { vehicleId: string }) => {
  const { isBlocked } = useRouteGuard();
  if (isBlocked) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-12 lg:gap-16 xl:gap-20 w-full mx-auto max-w-7xl md:pt-8 pt-4 pb-32">
      <div className="flex flex-col xl:gap-8 gap-6">
        <h1 className="hidden md:flex xl:text-5xl text-4xl font-semibold flex-col gap-1">
          <span>It&apos;s easy to get</span>
          <span>started on OtmRides</span>
        </h1>
        <h1 className="sm:text-4xl text-3xl font-semibold md:hidden">
          It&apos;s easy to get started on OtmRides
        </h1>
      </div>

      <div className="flex flex-col gap-8 ml-auto w-full xl:max-w-162">
        {PHASES_TO_LIST.map((phase, index) => {
          const { title, description, image } = phase;
          return (
            <div
              key={title}
              className={cn(
                "flex sm:flex-row flex-col gap-8 justify-between",
                index <= 1 && "border-b border-border pb-8",
              )}
            >
              <div className="flex gap-4">
                <div className="xl:text-xl text-lg font-bold">{index + 1}</div>
                <div className="flex flex-col gap-1">
                  <h2 className="xl:text-xl text-lg font-semibold">{title}</h2>
                  <p className="xl:text-lg text-base text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
              <div className="relative w-fit h-fit shrink">
                <Image
                  src={image}
                  alt={`${title.slice(0, 20)}-${index + 1}`}
                  width={128}
                  height={128}
                  priority
                  loading="eager"
                  className="object-cover h-auto w-auto min-h-20 min-w-20"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed z-50 left-0 bottom-0 bg-card border-t-4 border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex sm:justify-end justify-center items-center">
        <Link
          href={`/become-a-host/${vehicleId}/about-your-vehicle`}
          className="py-3 px-8 flex items-center justify-center gap-2 sm:w-fit w-full sm:text-base text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out"
        >
          Get started
        </Link>
      </div>
    </div>
  );
};

export default Overview;
