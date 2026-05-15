"use client";
// NavbarSkeleton.tsx — mirrors the real navbar's structure exactly.
// Shown on SSR + first client paint to prevent hydration mismatches.
// Matches: logo | NavCenter (NavigationBar + SearchPanel) | right actions

import { Skeleton } from "@/components/ui/skeleton";

const RentingNavbarSkeleton = () => {
  return (
    <div className="hidden md:flex sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 h-24 bg-background shadow-sm">
      <div className="relative w-full flex items-start justify-between gap-x-10">
        {/* ── Logo (left) ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 h-12 shrink-0">
          {/* Logo image circle */}
          <Skeleton className="w-10 h-10 rounded-full" />
          {/* Brand name text */}
          <Skeleton className="block w-24 h-5 rounded-full" />
        </div>

        {/* ── Right actions ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2 h-12 shrink-0">
          {/* "Become a host" text pill */}
          <Skeleton className="block w-28 h-9 rounded-full" />
          {/* Hamburger/avatar button */}
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default RentingNavbarSkeleton;
