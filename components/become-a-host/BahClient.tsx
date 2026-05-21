"use client";
import { Bike } from "lucide-react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BahFooter from "./BahFooter";
import BahClientSkeleton from "./BahClientSkeleton";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getListingDrafts } from "@/lib/api/become-a-host";

interface DraftItem {
  id: string;
  vehicleType?: string;
  displayName?: string;
  draftLastSavedAt: string;
  draftStep: number;
}

const DEMO_DRAFTS: DraftItem[] = [
  {
    id: "1",
    displayName: "My Red Activa",
    draftLastSavedAt: "2 minutes",
    draftStep: 2,
  },
  {
    id: "2",
    vehicleType: "Bike",
    draftLastSavedAt: "4 days",
    draftStep: 4,
  },
  {
    id: "3",
    vehicleType: "Bike",
    displayName: "BMW R9T - Perfect for rides",
    draftLastSavedAt: "1 days",
    draftStep: 3,
  },
];

const PHASES_TO_LIST = [
  {
    title: "Tell us about your vehicle",
    description:
      "Share your bike or scooter details, specs, and where it's parked.",
    image: "/bah_phase1.png",
  },
  {
    title: "Make it stand out",
    description:
      "Add photos and highlight the features that make your ride special.",
    image: "/bah_phase2.png",
  },
  {
    title: "Set your terms and go live",
    description:
      "Set your price, policies, and upload documents for verification.",
    image: "/bah_phase3.png",
  },
];

const BahClient = () => {
  const {
    data: listingDrafts,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getListingDrafts,
  });

  console.log(listingDrafts);

  if (loading) {
    return <BahClientSkeleton />;
  }

  if (isError) {
    return <div>Cant fetch listing drafts.</div>;
  }

  return (
    <>
      {listingDrafts && listingDrafts.length > 0 ? (
        <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
          <h1 className="text-3xl font-semibold">Welcome back, Sudip</h1>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Finish your listing</h2>
            <div className="flex flex-col gap-4">
              {listingDrafts.map((draft, index) => {
                const { id, displayName, model, draftLastSavedAt, draftStep } =
                  draft;
                const totalSteps = 8;
                const progress = Math.round((draftStep * 100) / totalSteps);
                return (
                  <div key={id} className="relative w-full h-fit">
                    <button
                      className="absolute z-10 sm:top-4 sm:right-4 top-2 right-2 w-fit h-fit cursor-pointer text-secondary/80 p-2 rounded-full hover:bg-accent/50"
                      onClick={() => alert("hello")}
                    >
                      <RiDeleteBin6Line className="size-4" />
                    </button>
                    <Link
                      href="/"
                      className="sm:p-6 p-4 p w-full rounded-xl border border-border flex flex-col gap-6 hover:bg-accent/30 hover:border-secondary/80 transition-colors duration-200 ease-in-out"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-sm bg-accent/50 p-3 w-fit h-fit">
                          <Bike className="size-6 text-secondary" />
                        </div>
                        <div className="flex flex-col pr-8">
                          <h3 className="font-medium sm:text-lg text-base">
                            {displayName
                              ? displayName
                              : `Your ${model?.type ? model.type : "Vehicle"} listing`}
                          </h3>
                          <p className="sm:text-sm text-xs">{`Last edited ${draftLastSavedAt} ago`}</p>
                        </div>
                      </div>
                      <div className="w-full flex flex-col">
                        <div className="text-xs">{`Step ${draftStep} of ${totalSteps} complete`}</div>
                        <div className="flex items-center gap-8 justify-between">
                          <div className="relative h-1 w-full overflow-hidden rounded-full bg-accent">
                            <div
                              className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out animate-pulse"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <FiChevronRight className="size-5" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col mt-6 gap-2">
            <h2 className="text-xl font-semibold">Start a new listing</h2>
            <Link
              href="/"
              className="py-6 border-b border-border flex items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-8 font-medium text-lg">
                <div className="relative">
                  <Bike className="size-7" />
                  <IoMdAddCircleOutline className="size-5 absolute -top-2 -right-4" />
                </div>
                Create a new listing
              </div>
              <FiChevronRight className="size-6" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-12 lg:gap-16 xl:gap-20 w-full mx-auto max-w-7xl md:pt-8 pt-4 pb-30">
          <div className="flex flex-col xl:gap-8 gap-6">
            <h1 className="hidden md:flex xl:text-5xl text-4xl font-semibold flex-col gap-1">
              <span>It&apos;s easy to get</span>
              <span>started on OtmRides</span>
            </h1>
            <h1 className="sm:text-4xl text-3xl font-semibold md:hidden">
              It&apos;s easy to get started on OtmRides
            </h1>
          </div>

          <div className="flex flex-col gap-8 ml-auto w-full xl:max-w-162">
            {PHASES_TO_LIST.map((phase, index) => {
              const { title, description, image } = phase;
              return (
                <div
                  key={title}
                  className={cn(
                    "flex sm:flex-row flex-col gap-8 justify-between",
                    index <= 1 && "border-b border-border pb-8",
                  )}
                >
                  <div className="flex gap-4">
                    <div className="xl:text-xl text-lg font-bold">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="xl:text-xl text-lg font-semibold">
                        {title}
                      </h2>
                      <p className="xl:text-lg text-base text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                  <div className="relative w-fit h-fit shrink">
                    <Image
                      src={image}
                      alt={`${title.slice(0, 20)}-${index + 1}`}
                      width={128}
                      height={128}
                      priority
                      loading="eager"
                      className="object-cover h-auto w-auto min-h-20 min-w-20"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <BahFooter />
        </div>
      )}
    </>
  );
};

function PlusIcon() {
  return (
    <div className="relative">
      <Bike className="size-5" />
      <IoMdAddCircleOutline className="size-3 absolute -top-1 -right-2" />
    </div>
  );
}

export default BahClient;
