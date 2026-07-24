"use client";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const DraftSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <Skeleton className="w-80 h-12" />
      <div className="flex flex-col gap-4">
        <Skeleton className="w-40 h-6" />
        {[1, 2].map((i) => {
          return (
            <div
              key={i}
              className="w-full px-4 py-5 rounded-xl border border-border flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="rounded-md w-12 h-12" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-50 h-5" />
                  <Skeleton className="w-70 h-3" />
                </div>
              </div>
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-40 h-6" />
        <div className="flex items-center py-4 gap-4 justify-between cursor-pointer border-b border-border">
          <div className="flex items-center gap-4">
            <Skeleton className="rounded-md w-8 h-8" />
            <Skeleton className="w-50 h-5" />
          </div>
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default DraftSkeleton;
