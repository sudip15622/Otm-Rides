"use client";
import { User } from "@/types/types";
import Image from "next/image";

interface SummarySectionProps {
  user: User;
}

function getFirstName(fullName: string) {
  return fullName.split(" ")[0];
}

function getRolesAsString(roles: string[]) {
  return roles.join(", ");
}

const SummarySection = ({ user }: SummarySectionProps) => {
  return (
    <div className="flex flex-col w-full mx-auto md:mx-0 max-w-sm items-center justify-center gap-4 p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer rounded-4xl bg-card border border-border/50">
      <div className="relative w-fit h-fit">
        <Image
          src={user.avatar || "/default_user.png"}
          alt={user.name}
          width={96}
          height={96}
          loading="eager"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{getFirstName(user.name)}</h1>
        <p className="text-sm text-muted-foreground">
          {getRolesAsString(user.roles)}
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
