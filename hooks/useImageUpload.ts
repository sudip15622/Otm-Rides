// hooks/useImageUpload.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUploadSignature, attachImage } from "@/lib/api/draft";
import { queryKeys } from "@/lib/query-keys";
import { DraftVehicle } from "@/types/types";

export function useImageUpload(vehicleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // 1. Ask our backend for signed upload params — this proves to
      //    Cloudinary that the request is authorized, without exposing
      //    our api_secret to the browser.
      const { signature, timestamp, apiKey, cloudName, folder } =
        await getUploadSignature(vehicleId);

      // 2. Upload the actual file bytes directly to Cloudinary.
      //    Our server never touches the file — faster and cheaper.
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!res.ok) {
        throw new Error("Upload to Cloudinary failed");
      }

      const cloudinaryData = await res.json();

      // 3. Register the uploaded image against the draft on our backend —
      //    this is what actually creates the VehicleImage row.
      return attachImage(vehicleId, {
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      });
    },

    onSuccess: (updatedDraft: DraftVehicle) => {
      // Merge into cache immediately so the new photo appears without a refetch
      queryClient.setQueryData(queryKeys.draft(vehicleId), updatedDraft);
    },
  });
}
