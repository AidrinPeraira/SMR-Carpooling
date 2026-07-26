"use client";

import { useRef } from "react";
import { Avatar, Loader, useToast } from "@sharemyride/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageFileTypes } from "@sharemyride/shared";
import { getAvatarUploadUrlRequest } from "../api/requests/getAvatarUploadUrlRequest";
import { updateAvatarRequest } from "../api/requests/updateAvatarRequest";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface Props {
  src?: string;
  initials?: string;
}

export function ProfileImageComponent({ src, initials }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const presignedResult = await getAvatarUploadUrlRequest({
        file_type: file.type as ImageFileTypes,
      });

      const signedUrl = presignedResult.url;

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image binary to storage");
      }

      const urlObj = new URL(signedUrl);
      const keyIndex = urlObj.pathname.indexOf("user-files/");
      const imagePath =
        keyIndex !== -1
          ? urlObj.pathname.substring(keyIndex)
          : urlObj.pathname.replace(/^\//, "");

      const response = await updateAvatarRequest({
        profile_image: imagePath,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast("Avatar updated!", {
        variant: "success",
        description: "Your profile picture has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast("Upload failed", {
        variant: "error",
        description:
          error.message || "Something went wrong while uploading avatar.",
      });
    },
  });

  const isUploading = uploadAvatarMutation.isPending;

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast("File too large", {
        variant: "error",
        description: "Profile picture must be under 5MB.",
      });
      e.target.value = "";
      return;
    }

    const allowedTypes: string[] = [
      ImageFileTypes.JPG,
      ImageFileTypes.PNG,
      ImageFileTypes.WEBP,
    ];
    if (!allowedTypes.includes(file.type)) {
      toast("Invalid file type", {
        variant: "error",
        description: "Only JPG, PNG, and WEBP images are allowed.",
      });
      e.target.value = "";
      return;
    }

    uploadAvatarMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div
        className="relative group cursor-pointer flex flex-col items-center"
        onClick={handleClick}
      >
        <div className="relative">
          <Avatar src={src} initials={initials} size="lg" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <span className="text-xs text-primary font-semibold mt-2 group-hover:underline">
          {isUploading ? "Uploading..." : "Change Photo"}
        </span>
      </div>
    </div>
  );
}
