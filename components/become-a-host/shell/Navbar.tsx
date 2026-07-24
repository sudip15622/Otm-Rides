"use client";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { saveStepPartial } from "@/lib/api/draft";
import { getRoute } from "@/lib/host/routes";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import type { DraftVehicle } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function getSlugFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

const Navbar = ({ vehicleId }: { vehicleId: string }) => {
  const { getSaveData } = useDraftNavbar();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const slug = getSlugFromPath(pathname);
  const route = getRoute(slug);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      saveStepPartial(vehicleId, route.stepNumber!, data),
    onSuccess: (updatedDraft) => {
      queryClient.setQueryData(
        queryKeys.draft(vehicleId),
        (prev: DraftVehicle | undefined) =>
          prev ? { ...prev, ...updatedDraft } : updatedDraft,
      );

      queryClient.invalidateQueries({ queryKey: queryKeys.listingDrafts });
      toast.success("Progress saved. Resume anytime.");
      router.replace("/");
    },
    onError: () => {
      toast.error("Couldn't save. Try again.");
    },
  });

  async function handleSaveAndExit() {
    if (route.kind === "info") {
      router.push("/");
      return;
    }

    const data = getSaveData() ?? {};
    mutation.mutate(data);
  }
  return (
    <header
      className={cn(
        "flex items-center justify-between bg-card sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 transition-colors duration-200 h-24",
        isScrolled && "shadow-sm",
      )}
    >
      <Link href="/" className="relative w-10 h-10 opacity-80">
        <Image
          src="/otmrides_black-01.png"
          alt="logo"
          fill
          sizes="48px"
          className="object-cover w-full h-full"
          priority
        />
      </Link>

      <button
        type="button"
        onClick={handleSaveAndExit}
        disabled={mutation.isPending}
        className="py-2 px-4 bg-card rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm disabled:cursor-not-allowed cursor-pointer"
      >
        {mutation.isPending ? "Saving..." : "Save & Exit"}
      </button>
    </header>
  );
};

export default Navbar;
