"use client";
import { getRoute, ROUTES } from "@/lib/host/routes";
import { UploadPhotosPopup } from "./photos/UploadPhotosPopup";
import { useRouter } from "next/navigation";
import { useDraft } from "@/contexts/DraftContext";
import { useDraftNavbar } from "@/contexts/DraftNavbarContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { deleteImage, reorderImages, saveStep } from "@/lib/api/draft";
import { DraftVehicle } from "@/types/types";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { MAX_VEHICLE_IMAGES, MIN_VEHICLE_IMAGES } from "@/lib/schemas/draft";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "../shell/Footer";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

const ROUTE = getRoute("photos");

interface ImageTileProps {
  id: string;
  url: string;
  isPrimary: boolean;
  onMakePrimary: () => void;
  onDelete: () => void;
  isBusy: boolean;
}

function ImageTile({
  id,
  url,
  isPrimary,
  onMakePrimary,
  onDelete,
  isBusy,
}: ImageTileProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // useSortable wires this tile up to dnd-kit's drag system.
  // `attributes` and `listeners` go on the draggable surface.
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "relative rounded-2xl aspect-3/2 overflow-hidden border border-border group cursor-grab active:cursor-grabbing",
        isPrimary && "xs:col-span-2 xs:row-span-2",
        isDragging && "opacity-50 z-10",
      )}
    >
      <Image
        src={url}
        alt="Vehicle"
        fill
        quality={90}
        loading="eager"
        sizes={
          isPrimary
            ? "(max-width: 480px) 100vw, (max-width: 768px) 100vw, 66vw"
            : "(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
        }
        className="object-cover pointer-events-none"
      />

      {isPrimary && (
        <span className="absolute top-2 left-2 bg-background text-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
          Cover Photo
        </span>
      )}

      <div
        className="absolute top-2 right-2"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={isBusy}
          onClick={() => {
            onDelete();
            setMenuOpen(false);
          }}
          className="p-2 rounded-full bg-card text-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </div>
  );
}

const PhotosStep = ({ vehicleId }: { vehicleId: string }) => {
  const router = useRouter();
  const { draft, updateDraft } = useDraft();
  const { registerSaveData } = useDraftNavbar();
  const { isBlocked } = useRouteGuard();
  const queryClient = useQueryClient();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);

  const uploadMutation = useImageUpload(vehicleId);

  useEffect(() => {
    registerSaveData(() => null);
  }, [registerSaveData]);

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => deleteImage(vehicleId, imageId),
    onSuccess: (updated: DraftVehicle) =>
      queryClient.setQueryData(queryKeys.draft(vehicleId), updated),
    onError: () => toast.error("Failed to delete photo."),
  });

  const reorderMutation = useMutation({
    mutationFn: (order: { id: string; sortOrder: number }[]) =>
      reorderImages(vehicleId, { order }),
    onSuccess: (updated: DraftVehicle) =>
      queryClient.setQueryData(queryKeys.draft(vehicleId), updated),
    onError: () => {
      toast.error("Failed to reorder photos.");
      // Roll back to server state on failure
      queryClient.invalidateQueries({ queryKey: queryKeys.draft(vehicleId) });
    },
  });

  const images = draft.images ?? [];
  const imageCount = images.length;
  const roomLeft = MAX_VEHICLE_IMAGES - imageCount;
  const hasMinImages = imageCount >= MIN_VEHICLE_IMAGES;
  const hasTooManyImages = imageCount > MAX_VEHICLE_IMAGES;

  const handleUploadFiles = useCallback(
    async (files: File[]) => {
      setIsUploadingBatch(true);
      try {
        // Upload sequentially so sortOrder assignment on the backend
        // (existingCount at time of create) stays predictable.
        for (const file of files) {
          await uploadMutation.mutateAsync(file);
        }
        setIsPopupOpen(false);
      } catch {
        toast.error("Some photos failed to upload. Please try again.");
      } finally {
        setIsUploadingBatch(false);
      }
    },
    [uploadMutation],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // avoids accidental drags on tap
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(images, oldIndex, newIndex);

    const withUpdatedPrimary = reordered.map((img, index) => ({
      ...img,
      isPrimary: index === 0,
    }));

    // Optimistic update — reflect new order immediately in the UI
    queryClient.setQueryData(queryKeys.draft(vehicleId), {
      ...draft,
      images: withUpdatedPrimary,
    });

    reorderMutation.mutate(
      withUpdatedPrimary.map((img, index) => ({
        id: img.id,
        sortOrder: index,
        isPrimary: index === 0,
      })),
    );
  }

  const saveMutation = useMutation({
    mutationFn: () => saveStep(vehicleId, ROUTE.stepNumber!, {}),
    onSuccess: (updated) => {
      updateDraft(updated);
      const nextIndex = ROUTES.findIndex((r) => r.slug === ROUTE.slug) + 1;
      router.push(`/become-a-host/${vehicleId}/${ROUTES[nextIndex].slug}`);
    },
    onError: () => toast.error("Failed to continue. Please try again."),
  });

  function handleMakePrimary(imageId: string) {
    const targetIndex = images.findIndex((img) => img.id === imageId);
    if (targetIndex === -1 || targetIndex === 0) return;

    const reordered = arrayMove(images, targetIndex, 0);
    const withUpdatedPrimary = reordered.map((img, index) => ({
      ...img,
      isPrimary: index === 0,
    }));

    queryClient.setQueryData(queryKeys.draft(vehicleId), {
      ...draft,
      images: withUpdatedPrimary,
    });

    reorderMutation.mutate(
      withUpdatedPrimary.map((img, index) => ({
        id: img.id,
        sortOrder: index,
        isPrimary: index === 0,
      })),
    );
  }

  if (isBlocked) return null;
  return (
    <div className="pb-32 w-full mx-auto max-w-xl flex flex-col gap-8">
      <div className="flex flex-col xs:flex-row items-start xs:justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">
            {imageCount === 0
              ? "Add some photos of your vehicle"
              : hasMinImages
                ? "Ta da! how does this look?"
                : "Add more photos"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {imageCount === 0
              ? "Add at least 3-10 max photos. Great photos help you get more bookings."
              : "Drag the images to reorder them."}
          </p>
        </div>
        {roomLeft > 0 && imageCount > 0 && (
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="w-fit py-2 px-3 xs:px-2 bg-accent/50 hover:bg-accent xs:rounded-full rounded-2xl flex items-center gap-2 text-sm text-secondary cursor-pointer"
          >
            <Plus className="xs:size-6 size-5" />
            <span className="xs:hidden">Add more</span>
          </button>
        )}
      </div>
      {imageCount === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 w-full p-4 h-80 bg-accent/20">
          <Image
            src="/photo_step_hero.png"
            width={100}
            height={100}
            alt="add-photos"
            loading="eager"
            className="w-auto h-auto object-cover"
          />
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="py-2.5 px-6 rounded-xl bg-foreground text-background font-medium text-sm cursor-pointer"
          >
            Add photos
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 auto-rows-fr sm:auto-rows-auto">
              {images.map((img) => (
                <ImageTile
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  isPrimary={img.isPrimary}
                  onMakePrimary={() => handleMakePrimary(img.id)}
                  onDelete={() => deleteMutation.mutate(img.id)}
                  isBusy={reorderMutation.isPending || deleteMutation.isPending}
                />
              ))}

              {/* Add-more tile — not draggable, always last */}
              {roomLeft > 0 && (
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  className="aspect-3/2 text-muted-foreground rounded-2xl border-2 border-dashed border-border flex flex-col cursor-pointer items-center justify-center hover:bg-accent/40"
                >
                  <Plus className="size-6 text-muted-foreground" />
                  Add more
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {!hasMinImages && (
        <p className="text-xs text-muted-foreground">
          {MIN_VEHICLE_IMAGES - imageCount} more photo
          {MIN_VEHICLE_IMAGES - imageCount !== 1 ? "s" : ""} needed to continue.
        </p>
      )}

      {hasMinImages && roomLeft === 0 && (
        <p className="text-xs text-muted-foreground">
          You've reached the maximum of {MAX_VEHICLE_IMAGES} photos.
        </p>
      )}

      <AnimatePresence>
        {isPopupOpen && (
          <UploadPhotosPopup
            onClose={() => setIsPopupOpen(false)}
            onUpload={handleUploadFiles}
            isUploading={isUploadingBatch}
            maxFiles={roomLeft}
          />
        )}
      </AnimatePresence>

      <Footer
        vehicleId={vehicleId}
        isLoading={saveMutation.isPending}
        isContinueDisabled={
          !hasMinImages || hasTooManyImages || isUploadingBatch
        }
        onContinue={() => {
          if (isUploadingBatch) {
            toast.info("Wait until image uploading.");
          }
          if (!hasMinImages) {
            toast.error(
              `Need atleast ${MIN_VEHICLE_IMAGES} photos to continue.`,
            );
            return;
          }
          if (hasTooManyImages) {
            toast.error(`Can't upload more than ${MAX_VEHICLE_IMAGES} images.`);
            return;
          }
          saveMutation.mutate();
        }}
      />
    </div>
  );
};

export default PhotosStep;
