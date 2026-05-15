"use client";
import { Skeleton } from "@/components/ui/skeleton";

const ActionFootSkeleton = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center border-t bg-card px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1"
        >
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-10 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default ActionFootSkeleton;
