"use client";
import { useAuth } from "@/contexts/AuthContext";
import { createDraft, deleteDraft, getListingDrafts } from "@/lib/api/draft";
import { formatDate } from "@/lib/formatDate";
import { queryKeys } from "@/lib/query-keys";
import { ListingDraft } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bike, Dot } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoChevronRight, GoPlusCircle } from "react-icons/go";
import { FiPlusSquare } from "react-icons/fi";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import DraftSkeleton from "./DraftSkeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BarLoader } from "react-spinners";
import { getResumeSlug } from "@/lib/host/routes";

function getFirstName(name: string) {
  return name.split(" ")[0];
}

const LandingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);

  const { data: drafts = [], isLoading } = useQuery({
    queryKey: queryKeys.listingDrafts,
    queryFn: getListingDrafts,
  });

  const createMutation = useMutation({
    mutationFn: createDraft,
    onSuccess: (draft) => {
      queryClient.setQueryData(
        queryKeys.listingDrafts,
        (old: ListingDraft[] = []) => [...old, draft],
      );
      toast.success("New listing created successfully!");
      router.push(`/become-a-host/${draft.id}/overview`);
    },
    onError: (error) => {
      toast.error(error.message);
      toast.error("Failed to create new listing.");
    },
  });

  const handleCreateNew = () => {
    if (drafts.length >= 3) {
      setShowModal(true);
      return;
    }
    createMutation.mutate();
  };

  if (!user) return null;

  if (loading || isLoading) {
    return <DraftSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col w-full max-w-2xl mx-auto gap-8">
        <h1 className="text-3xl font-semibold">
          Welcome, {getFirstName(user.name)}
        </h1>
        <AnimatePresence>
          {showModal && (
            <DraftsModal
              drafts={drafts}
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
        </AnimatePresence>

        {/* your drafts  */}
        {drafts && drafts.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg">Finish your listing</h2>
              {drafts.map((draft) => {
                return <DraftCard key={draft.id} draft={draft} />;
              })}
            </div>

            {/* create new listing */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg">Start a new listing</h2>
              <button
                type="button"
                disabled={createMutation.isPending}
                onClick={handleCreateNew}
                className="relative flex items-center py-4 gap-4 justify-between cursor-pointer border-b border-border"
              >
                <div className="flex items-center text-left gap-4 font-medium">
                  <FiPlusSquare className="size-7" />
                  Create a new listing
                </div>
                <GoChevronRight className="size-6" />
                {createMutation.isPending && (
                  <div className="absolute left-0 bottom-0 w-full">
                    <BarLoader width="100%" color="gray" />
                  </div>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="relative w-fit h-fit">
              <Image
                src="/past_trips.png"
                alt="no-drafts"
                width={80}
                height={80}
                loading="eager"
                className="w-12 h-12 sm:w-20 sm:h-20 object-cover"
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center md:w-1/2">
              <h2 className="font-bold text-lg">No Drafts saved yet!</h2>
              <p className="text-sm text-muted-foreground">
                You'll find your saved drafts here after you've created your
                first listing on OtmRides.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="py-3 px-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 duration-200 transition-colors ease-in-out text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-t-2 border-border rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create new listing</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

function DraftCard({ draft }: { draft: ListingDraft }) {
  const { id, displayName, draftStep, draftLastSavedAt } = draft;
  const resumeSlug = getResumeSlug(draftStep);
  return (
    <Link
      href={`/become-a-host/${id}/${resumeSlug}`}
      className="w-full px-2 sm:px-4 py-3 sm:py-5 rounded-xl border border-border hover:bg-accent/50 hover:border-secondary/50 transition-colors duration-200 ease-in-out flex items-center justify-between gap-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <div className="bg-accent rounded-md p-3">
          <Bike className="size-6" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <h3 className="truncate font-medium leading-tight">
            {displayName ? displayName : "Your vehicle listing"}
          </h3>
          <p className="flex flex-row items-center gap-px text-xs sm:text-sm text-muted-foreground w-full truncate overflow-hidden">
            <span>{`Step ${draftStep} of 8`}</span>
            <Dot className="" />
            <span>{formatDate(draftLastSavedAt)}</span>
          </p>
        </div>
      </div>
      <GoChevronRight className="size-6 text-muted-foreground hidden sm:block" />
    </Link>
  );
}

interface DraftsModalProps {
  drafts: ListingDraft[];
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}

function DraftsModal({ drafts, setShowModal }: DraftsModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (draftIds: string[]) => {
      await Promise.all(draftIds.map((draftId) => deleteDraft(draftId)));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.listingDrafts,
      });
      setSelected([]);
      setShowModal(false);
      toast.success("Draft(s) deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete draft(s).");
    },
  });

  const handleToggleDraft = (draftId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelected((current) => current.filter((id) => id !== draftId));
      return;
    }
    setSelected((current) => [...current, draftId]);
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      return;
    }

    deleteMutation.mutate(selected);
  };

  const handleClearSelection = () => {
    setSelected([]);
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 bg-black/50 top-0 left-0 right-0 bottom-0 w-full h-full flex sm:items-center items-end mt-auto justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative w-full bg-card max-w-full sm:max-w-xl sm:rounded-4xl rounded-t-4xl shadow-md sm:px-8 px-4 py-6 sm:py-8 flex flex-col gap-4"
      >
        <button
          disabled={deleteMutation.isPending}
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-accent/50 cursor-pointer"
        >
          <RxCross2 className="size-5" />
        </button>
        <div className="text-center mb-4 gap-2">
          <h1 className="text-lg font-bold leading-tight">Delete a draft</h1>
          <p className="text-sm text-muted-foreground leading-tight max-w-sm mx-auto">
            You cannot have more than 3 drafts. Select the drafts to delete and
            create new.
          </p>
        </div>

        {drafts.length > 0 &&
          drafts.map((draft) => {
            const { id, displayName, draftStep, draftLastSavedAt } = draft;
            const isSelected = selected.includes(id);
            return (
              <button
                type="button"
                onClick={() => handleToggleDraft(id, isSelected)}
                key={id}
                className={cn(
                  "w-full px-2 py-3 rounded-xl border border-border transition-colors duration-200 ease-in-out flex items-center justify-between gap-4 overflow-hidden cursor-pointer text-left",
                  isSelected && "bg-accent/50 border-secondary/50",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                  <div className="bg-accent rounded-md p-3">
                    <Bike className="size-6" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <h3 className="truncate font-medium leading-tight">
                      {displayName ? displayName : "Your vehicle listing"}
                    </h3>
                    <p className="flex flex-row items-center gap-px text-xs sm:text-sm text-muted-foreground w-full truncate overflow-hidden">
                      <span>{`Step ${draftStep} of 8`}</span>
                      <Dot className="" />
                      <span>{formatDate(draftLastSavedAt)}</span>
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

        <div className="flex items-center gap-4 justify-between sm:justify-end mt-2">
          <button
            type="button"
            onClick={handleClearSelection}
            disabled={deleteMutation.isPending}
            // disabled={selected.length === 0}
            className="py-2 px-3 rounded-xl text-sm bg-none hover:bg-accent/50 disabled:bg-none cursor-pointer disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={selected.length === 0 || deleteMutation.isPending}
            className="py-2 px-3 rounded-xl text-sm bg-destructive text-card hover:bg-destructive/80 cursor-pointer disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-t-2 border-border rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              `Delete (${selected.length})`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// interface EmptySectionProps {
//   createNew: () => void;
// }

// function EmptySection({ createNew }: EmptySectionProps) {
//   return (
//     <div className="w-full flex flex-col items-center justify-center gap-4">
//       <div className="relative w-fit h-fit">
//         <Image
//           src="/past_trips.png"
//           alt="no-drafts"
//           width={80}
//           height={80}
//           loading="eager"
//           className="w-12 h-12 sm:w-20 sm:h-20 object-cover"
//         />
//       </div>
//       <div className="flex flex-col items-center justify-center text-center md:w-1/2">
//         <h2 className="font-bold text-lg">No Drafts saved yet!</h2>
//         <p className="text-sm text-muted-foreground">
//           You'll find your saved drafts here after you've created your first
//           listing on OtmRides.
//         </p>
//       </div>
//       <button
//         onClick={createNew}
//         className="py-3 px-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 duration-200 transition-colors ease-in-out text-sm font-medium cursor-pointer"
//       >
//         Create new listing
//       </button>
//     </div>
//   );
// }

export default LandingPage;
