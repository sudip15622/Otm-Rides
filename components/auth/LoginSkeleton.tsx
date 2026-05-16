"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoginSkeleton = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl sm:rounded-4xl sm:flex-row">
      <div className="relative hidden min-h-140 w-1/2 sm:flex lg:w-[60%]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-r-3xl" />
      </div>

      <div className="relative flex w-full flex-col items-center justify-start gap-5 px-4 pb-8 pt-14 sm:w-1/2 sm:justify-center sm:gap-6 sm:px-8 sm:py-8 lg:w-[40%] lg:px-16">
        <Skeleton className="absolute top-4 left-4 h-10 w-10 rounded-full" />

        <div className="flex w-fit justify-center items-center">
          <Skeleton className="relative h-10 w-10 rounded-full" />
        </div>

        <div className="flex flex-col text-center gap-1 w-full">
          <div className="mx-auto w-40">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <div className="mx-auto mt-1 w-36">
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>

        <div className="max-w-sm text-center text-xs">
          <Skeleton className="h-3 w-64 mx-auto rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;
