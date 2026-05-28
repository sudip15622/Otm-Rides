"use client";
import { Bike } from "lucide-react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BahClientSkeleton from "./BahClientSkeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createDraft,
  deleteDraft,
  getListingDrafts,
} from "@/lib/api/become-a-host";
import { useRouter } from "next/navigation";
import { ListingDraft } from "@/types/types";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";

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
  const router = useRouter();
  const {
    data: listingDrafts = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: queryKeys.listingDrafts,
    queryFn: getListingDrafts,
  });

  console.log(listingDrafts);

  const queryClient = useQueryClient();

  const { mutate: createMutate, isPending: createPending } = useMutation({
    mutationFn: createDraft,
    onSuccess: (draft) => {
      queryClient.setQueryData(
        queryKeys.listingDrafts,
        (old: ListingDraft[] = []) => [...old, draft],
      );
      router.push(`/become-a-host/${draft.id}/steps/1`);
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        toast.error(
          "You have 3 drafts already. Delete one to start a new listing.",
        );
      } else {
        toast.error("Can't create listing. Please try again.");
      }
    },
  });

  const handleGetStarted = () => {
    if (listingDrafts.length >= 3) {
      toast.error(
        "You cannot create more than 3 drafts. Please continue to one of them or delete.",
      );
      return;
    }
    createMutate();
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => deleteDraft(id),
    onMutate: async (id) => {
      const previous = queryClient.getQueryData<ListingDraft[]>(
        queryKeys.listingDrafts,
      );
      queryClient.setQueryData(
        queryKeys.listingDrafts,
        (old: ListingDraft[] = []) => old.filter((draft) => draft.id !== id),
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKeys.listingDrafts, context?.previous);
      toast.error("Can't delete listing draft.");
    },
    onSuccess: () => {
      toast.success("Successfully deleted draft");
    },
  });

  if (loading) {
    return <BahClientSkeleton />;
  }

  if (isError) {
    // router.push("/");
    // router.refresh();
    toast.error("Can't fetch your listing drafts");
    return <BahClientSkeleton />;
  }

  return (
    <>
      {listingDrafts && listingDrafts.length > 0 ? (
        <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
          <h1 className="text-3xl font-semibold">Welcome back, Sudip</h1>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Finish your listing</h2>
            <div className="flex flex-col gap-4">
              {listingDrafts.map((draft) => {
                const { id, displayName, model, draftLastSavedAt, draftStep } =
                  draft;
                const totalSteps = 8;
                const progress = Math.round((draftStep * 100) / totalSteps);
                return (
                  <div key={id} className="relative w-full h-fit">
                    <button
                      className="absolute z-10 sm:top-4 sm:right-4 top-2 right-2 w-fit h-fit cursor-pointer text-secondary/80 p-2 rounded-full hover:bg-accent/50"
                      onClick={() => deleteMutate(id)}
                    >
                      <RiDeleteBin6Line className="size-4" />
                    </button>
                    <Link
                      href={`/become-a-host/${id}/steps/${draftStep}`}
                      className="sm:p-6 p-4 p w-full rounded-xl border border-border flex flex-col gap-6 hover:bg-accent/30 hover:border-secondary/80 transition-colors duration-200 ease-in-out"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-sm bg-accent/50 p-3 w-fit h-fit">
                          <Bike className="size-6 text-secondary" />
                        </div>
                        <div className="flex flex-col pr-8">
                          <h3 className="font-medium sm:text-lg text-base">
                            {displayName ? displayName : "Your Vehicle listing"}
                          </h3>
                          <p className="sm:text-sm text-xs">{`Last edited ${formatDate(draftLastSavedAt)}`}</p>
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
            <button
              onClick={() => handleGetStarted()}
              disabled={createPending}
              className="py-6 border-b border-border flex items-center gap-4 justify-between cursor-pointer"
            >
              <div className="flex items-center gap-8 font-medium text-lg">
                <div className="relative">
                  <Bike className="size-7" />
                  <IoMdAddCircleOutline className="size-5 absolute -top-2 -right-4" />
                </div>
                {createPending
                  ? "Creating new listing..."
                  : "Create a new listing"}
              </div>
              <FiChevronRight className="size-6" />
            </button>
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
          <div className="fixed z-50 left-0 bottom-0 bg-card border-t border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex sm:justify-end justify-center items-center">
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={createPending}
              className="py-3 px-8 flex items-center justify-center gap-2 w-full sm:w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {createPending ? (
                <>
                  <span className="border-t border-border rounded-full animate-spin size-4" />
                  Starting...
                </>
              ) : (
                "Get Started"
              )}
            </button>
          </div>
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
