"use client";
// NavbarSkeleton.tsx — mirrors the real navbar's structure exactly.
// Shown on SSR + first client paint to prevent hydration mismatches.
// Matches: logo | NavCenter (NavigationBar + SearchPanel) | right actions

import { Skeleton } from "@/components/ui/skeleton";

const NavbarSkeleton = () => {
  return (
    <div className="sticky z-50 top-0 w-full flex py-6 px-4 sm:px-8 md:px-12 lg:px-16 h-45 bg-background shadow-sm">
      <div className="relative w-full flex items-start justify-between gap-x-10">
        {/* ── Logo (left) ───────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2 h-12 shrink-0">
          {/* Logo image circle */}
          <Skeleton className="w-10 h-10 rounded-full" />
          {/* Brand name text */}
          <Skeleton className="hidden xl:block w-24 h-5 rounded-full" />
        </div>

        {/* ── NavCenter (center, absolute) ──────────────────────────────── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl flex flex-col items-center">
          {/* ── NavigationBar skeleton (3 nav links) ── */}
          {/* Mirrors: flex items-center gap-x-10, h-12, mb-5 */}
          <div className="flex items-center justify-between gap-x-5 sm:gap-x-10 w-full sm:w-auto sm:px-8 md:px-0 mb-5 h-12">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1"
              >
                {/* Icon */}
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                {/* Label */}
                <Skeleton className="w-10 sm:w-14 h-3 sm:h-4 rounded-full" />
              </div>
            ))}
          </div>

          {/* ── SearchPanel skeleton ── */}

          {/* Mobile: single wide pill button */}
          <Skeleton className="flex md:hidden w-full h-12 rounded-full mb-6" />

          {/* Desktop: 3-pill search bar — h-16 matches showFullNav=true */}
          <div className="relative hidden md:grid grid-cols-3 w-full h-16 rounded-full border border-border overflow-hidden">
            {/* Where pill */}
            <div className="flex flex-col justify-center px-6 gap-y-1">
              <Skeleton className="w-10 h-3 rounded-full" />
              <Skeleton className="w-24 h-4 rounded-full" />
            </div>
            {/* When pill */}
            <div className="flex flex-col justify-center px-6 gap-y-1">
              <Skeleton className="w-10 h-3 rounded-full" />
              <Skeleton className="w-20 h-4 rounded-full" />
            </div>
            {/* Which pill */}
            <div className="flex flex-col justify-center px-6 gap-y-1">
              <Skeleton className="w-10 h-3 rounded-full" />
              <Skeleton className="w-20 h-4 rounded-full" />
            </div>
            {/* Search button */}
            <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 right-2 z-20">
              {/* Search button circle */}
              <Skeleton className="size-12 rounded-full shrink-0" />
            </div>
          </div>
        </div>

        {/* ── Right actions ─────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2 h-12 shrink-0">
          {/* "Become a host" text pill */}
          <Skeleton className="hidden xl:block w-28 h-9 rounded-full" />
          {/* Hamburger/avatar button */}
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default NavbarSkeleton;
