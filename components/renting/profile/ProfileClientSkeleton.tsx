"use client";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileClientSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto pb-30">
      {/* fixed top bar skeleton (switch + notification) */}
      <div className="fixed z-10 w-full top-0 left-0 bg-card py-4 flex items-center px-4 sm:px-6 justify-end">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-14" />

        <div className="flex items-center justify-between">
          <Skeleton className="w-28 h-8 rounded-md" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full mx-auto md:mx-0 max-w-sm items-center justify-center gap-4 p-8 shadow-lg rounded-4xl bg-card border border-border/50">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="text-center">
              <Skeleton className="w-40 h-6 rounded-md mx-auto" />
              <Skeleton className="w-24 h-4 rounded-md mx-auto mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="w-full h-28 rounded-2xl" />
            <Skeleton className="w-full h-28 rounded-2xl" />
          </div>

          <div className="w-full bg-card shadow-md border border-border/50 rounded-2xl p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-16 rounded-md" />
            <div className="flex-1">
              <Skeleton className="w-40 h-6 rounded-md mb-2" />
              <Skeleton className="w-full max-w-xs h-4 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12 rounded-md" />
          ))}
        </div>

        <div className="w-full h-px bg-border" />

        <Skeleton className="w-full h-12 rounded-md" />
      </div>
    </div>
  );
};

export default ProfileClientSkeleton;
