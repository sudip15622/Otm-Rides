"use client";
import { UserProfile } from "@/types/types";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FcRating } from "react-icons/fc";
import SummarySection from "./SummarySection";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const AboutMe = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <AboutMeSkeleton />;
  }

  if (!user) {
    router.push(`/login-signup?returnTo-${encodeURIComponent("/profile")}`);
    router.refresh();
    return <AboutMeSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 pt-10 md:pt-0">
      <div className="fixed w-full z-10 md:z-0 top-0 left-0 md:relative flex items-center justify-between md:justify-start gap-6 py-4 px-4 sm:px-6 md:px-0 bg-card md:bg-none md:py-0">
        <h1 className="hidden md:block text-3xl font-bold">About Me</h1>
        <Link
          href="/profile"
          className="flex items-center justify-center md:hidden rounded-full bg-accent/50 p-3"
        >
          <FaArrowLeft className="size-4 text-foreground/80" />
        </Link>
        <Link
          href="/profile/edit"
          className="py-3 md:py-2 px-6 md:px-4 font-medium text-xs text-accent-foreground rounded-full md:rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-200 ease-in-out"
        >
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
        <SummarySection user={user} />
        <div className="flex items-center md:items-start text-center md:text-start flex-col gap-4 w-full mx-auto md:mx-0 max-w-sm md:max-w-none">
          <h2 className="text-xl font-semibold">Complete your profile</h2>
          <p className="text-sm text-muted-foreground leading-tight">
            Your OtmRides profile is an important part of every reservation.
            Complete yours to help other hosts and tenants get to know you.
          </p>
          <Link
            href="/profile/edit"
            className="w-fit mt-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="bg-border w-full h-px my-4" />

      <Link
        href="/"
        className="flex items-center gap-2 md:p-2 hover:bg-accent/50 rounded-lg md:-ml-2 w-fit text-foreground/80"
      >
        <FcRating className="size-5" />
        Review OtmRides
      </Link>
    </div>
  );
};

function AboutMeSkeleton() {
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
}

export default AboutMe;
