"use client";
import React, { useCallback, useRef, useState } from "react";
import { X, Plus, ImagePlus, Trash2 } from "lucide-react";
import { PiImagesThin } from "react-icons/pi";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PendingFile {
  id: string; // local-only id, just for React keys
  file: File;
  previewUrl: string; // object URL — must be revoked on cleanup
}

interface UploadPhotosPopupProps {
  onClose: () => void;
  // Called with the final list of files when user clicks Upload
  onUpload: (files: File[]) => void;
  isUploading: boolean;
  maxFiles: number;
}

export function UploadPhotosPopup({
  onClose,
  onUpload,
  isUploading,
  maxFiles,
}: UploadPhotosPopupProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const roomLeft = maxFiles - pendingFiles.length;

  // Converts raw File objects into PendingFile entries with preview URLs
  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) return;

    const filesToAdd = imageFiles.slice(0, roomLeft);

    if (imageFiles.length > filesToAdd.length) {
      toast.info(
        `Only ${filesToAdd.length} more photo${filesToAdd.length !== 1 ? "s" : ""} can be added (max ${maxFiles} total).`,
      );
    }

    const newEntries: PendingFile[] = filesToAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...newEntries]);
  }, []);

  function handleBrowse(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting same file
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  // Removes a pending file AND revokes its object URL to avoid memory leaks
  function removePendingFile(id: string) {
    setPendingFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  // Cleans up every object URL — called on Cancel or successful Upload
  function revokeAllPreviews() {
    pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
  }

  function handleCancel() {
    revokeAllPreviews();
    onClose();
  }

  function handleUploadClick() {
    onUpload(pendingFiles.map((p) => p.file));
    // Note: we don't revoke here — parent will close the popup on success,
    // which triggers handleCancel-equivalent cleanup via unmount.
    // If you want previews to persist during upload progress, keep them until then.
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 inset-0 z-100 bg-black/50 flex sm:items-center items-end mt-auto justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-card relative sm:rounded-4xl rounded-t-4xl w-full max-w-full sm:max-w-lg flex flex-col shadow-xl max-h-[85vh] sm:px-8 px-4 py-6 gap-6"
      >
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="absolute top-2 left-2 w-fit p-2 rounded-full hover:bg-accent/60 flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          <Plus className="size-6" />
        </button>
        <button
          type="button"
          disabled={isUploading}
          onClick={handleCancel}
          className="absolute top-2 right-2 w-fit p-2 rounded-full hover:bg-accent/60 flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          <X className="size-5" />
        </button>
        {/* Header */}
        <div className="text-center">
          <h2 className="font-bold text-lg">Upload photos</h2>
          <p className="text-xs text-muted-foreground">
            {pendingFiles.length === 0
              ? "No items selected"
              : `${pendingFiles.length} item${pendingFiles.length !== 1 ? "s" : ""} selected`}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBrowse}
            className="hidden"
          />

          {pendingFiles.length === 0 ? (
            // Empty state — drag and drop zone
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 py-10 transition-colors",
                isDragOver ? "border-primary bg-accent/40" : "border-border",
              )}
            >
              <PiImagesThin className="size-20" />
              <div className="text-center flex flex-col gap-1">
                <p className="font-medium">Drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  or browse for photos
                </p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 py-2.5 px-6 rounded-xl bg-foreground text-background font-medium text-sm cursor-pointer"
              >
                Browse
              </button>
            </div>
          ) : (
            // Grid of temporary previews
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "grid grid-cols-1 xs:grid-cols-2 gap-3 rounded-2xl transition-colors",
                isDragOver && "bg-accent/40 ring-1 ring-secondary",
              )}
            >
              {pendingFiles.map((pf) => (
                <div
                  key={pf.id}
                  className="relative aspect-3/2 rounded-xl overflow-hidden border border-border group"
                >
                  <img
                    src={pf.previewUrl}
                    alt=""
                    className="object-cover h-full w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removePendingFile(pf.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-secondary/60 flex items-center justify-center hover:bg-secondary/90 cursor-pointer"
                  >
                    <Trash2 className="size-3.5 text-secondary-foreground" />
                  </button>
                </div>
              ))}

              {/* Add-more tile inside the grid itself */}
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="aspect-3/2 rounded-xl border-2 border-dashed border-border flex flex-col text-muted-foreground text-sm items-center justify-center hover:bg-accent/50 cursor-pointer disabled:cursor-not-allowed"
              >
                <Plus className="size-5" />
                Add more
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative w-full flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="py-2.5 px-4 font-medium text-sm rounded-xl hover:bg-accent/50 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={pendingFiles.length === 0 || isUploading}
            className="py-2.5 px-6 font-medium text-sm rounded-xl bg-foreground text-background disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-t-2 border-border rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
