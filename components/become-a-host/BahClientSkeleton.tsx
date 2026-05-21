"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BahClientSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col w-full max-w-2xl mx-auto gap-8"
    >
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64 rounded-lg" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-7 w-40 rounded-lg" />

          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="relative w-full h-fit rounded-xl">
                <div className="absolute z-10 sm:top-4 sm:right-4 top-2 right-2 p-2">
                  <Skeleton className="size-8 rounded-full" />
                </div>

                <div className="sm:p-6 p-4 w-full rounded-xl border border-border flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="size-12 rounded-md shrink-0" />

                    <div className="flex flex-col gap-2 pr-8 w-full max-w-[18rem]">
                      <Skeleton className="h-5 w-3/4 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-4 w-32 rounded-lg" />

                    <div className="flex items-center gap-4 justify-between">
                      <Skeleton className="h-1.5 w-full rounded-full" />
                      <Skeleton className="size-5 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-6 gap-2">
        <Skeleton className="h-7 w-48 rounded-lg" />

        <div className="py-6 border-b border-border flex items-center gap-4 justify-between">
          <div className="flex items-center gap-8">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-6 w-44 rounded-lg" />
          </div>
          <Skeleton className="size-6 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default BahClientSkeleton;
