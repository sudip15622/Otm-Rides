"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { User, UserProfile } from "@/types/types";
import Image from "next/image";
import React from "react";

interface SummarySectionProps {
  user: User | null;
}

function getFirstName(fullName: string) {
  return fullName.split(" ")[0];
}

function getRolesAsString(roles: string[]) {
  return roles.join(", ");
}

const SummarySection = ({ user }: SummarySectionProps) => {
  if (!user) {
    return null;
  }
  return (
    <div className="flex flex-col w-full mx-auto md:mx-0 max-w-sm items-center justify-center gap-4 p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer rounded-4xl bg-card border border-border/50">
      {user?.avatar && (
        <div className="relative w-fit h-fit">
          <Image
            src={user.avatar}
            alt={user.name}
            width={96}
            height={96}
            loading="eager"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{getFirstName(user?.name!)}</h1>
        <p className="text-sm text-muted-foreground">
          {getRolesAsString(user?.roles!)}
        </p>
      </div>
    </div>
  );
};

function SummarySectionSkeleton() {
  return (
    <div className="flex flex-col w-full mx-auto md:mx-0 max-w-sm items-center justify-center gap-4 p-8 shadow-lg rounded-4xl bg-card border border-border/50">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-40 h-8 rounded-2xl" />
        <Skeleton className="w-16 h-4 rounded-2xl" />
      </div>
    </div>
  );
}

export default SummarySection;
