"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createDraft } from "@/lib/api/become-a-host";

const BahFooter = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createDraft,
    onSuccess: (draft) => {
      router.push(`/become-a-host/${draft.id}/steps/1`);
    },
    onError: () => {
      alert("Can't create listing");
    },
  });

  const handleGetStarted = () => {
    mutate();
  };

  return (
    <footer className="fixed z-50 left-0 bottom-0 bg-card border-t border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex sm:justify-end justify-center items-center">
      <button
        type="button"
        onClick={handleGetStarted}
        disabled={isPending}
        className="py-3 px-8 flex items-center justify-center w-full sm:w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Starting..." : "Get started"}
      </button>
    </footer>
  );
};

export default BahFooter;
