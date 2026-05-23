"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AboutMeSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 pt-10 md:pt-0">
      <div className="fixed w-full z-10 md:z-0 top-0 left-0 md:relative flex items-center justify-between md:justify-start gap-6 py-4 px-4 sm:px-6 md:px-0 bg-card md:bg-none md:py-0">
        <div className="hidden md:block">
          <Skeleton className="w-40 h-8 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          <Skeleton className="w-20 h-8 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
        <div className="mx-auto md:mx-0 max-w-sm w-full">
          <div className="flex flex-col w-full mx-auto md:mx-0 max-w-sm items-center justify-center gap-4 p-8 shadow-lg rounded-4xl bg-card border border-border/50">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="text-center">
              <Skeleton className="w-40 h-6 rounded-md mx-auto" />
              <Skeleton className="w-24 h-4 rounded-md mx-auto mt-2" />
            </div>
          </div>
        </div>

        <div className="flex items-center md:items-start text-center md:text-start flex-col gap-4 w-full mx-auto md:mx-0 max-w-sm md:max-w-none">
          <Skeleton className="w-48 h-6 rounded-md" />
          <Skeleton className="w-full h-16 rounded-md" />
          <Skeleton className="w-32 h-10 rounded-xl" />
        </div>
      </div>

      <div className="bg-border w-full h-px my-4" />

      <div className="flex items-center gap-2 md:p-2 rounded-lg md:-ml-2 w-fit text-foreground/80">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-40 h-4 rounded-md" />
      </div>
    </div>
  );
};

export default AboutMeSkeleton;
