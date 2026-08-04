"use client";

import { useRef, useState } from "react";
import { Button, Label, Loader, useToast } from "@sharemyride/ui";
import { FileNames, ImageFileTypes } from "@sharemyride/shared";
import { getFileUploadUrlRequest } from "@/features/application/api/requests/getFileUploadUrlRequest";

const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface FileUploadComponentProps {
  fileName: FileNames;
  label: string;
  value?: string;
  onChange: (filePath: string, localPreviewUrl?: string) => void;
  error?: string;
  disabled?: boolean;
  accept?: string;
  maxSizeBytes?: number;
}

export function FileUploadComponent({
  fileName,
  label,
  value,
  onChange,
  error,
  disabled = false,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
}: FileUploadComponentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const toast = useToast();

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSizeBytes) {
      toast("File too large", {
        variant: "error",
        description: `File size must be under ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`,
      });
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
      return;
    }

    // Generate local blob URL for instant client-side preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    setIsUploading(true);
    setSelectedFileName(file.name);

    try {
      // Step 1: Fetch presigned upload URL from API
      const presignedResult = await getFileUploadUrlRequest({
        file_type: file.type as ImageFileTypes,
        file_name: fileName,
      });

      if (!presignedResult.success || !presignedResult.payload?.url) {
        throw new Error(presignedResult.message || "Failed to get upload URL");
      }

      const signedUrl = presignedResult.payload.url;

      // Step 2: Directly upload file binary to signed URL
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to cloud storage.");
      }

      // Step 3: Extract S3 path from signed URL
      const urlObj = new URL(signedUrl);
      const tempIndex = urlObj.pathname.indexOf("temp/");
      const userFilesIndex = urlObj.pathname.indexOf("user-files/");

      let extractedPath = "";
      if (tempIndex !== -1) {
        extractedPath = urlObj.pathname.substring(tempIndex);
      } else if (userFilesIndex !== -1) {
        extractedPath = urlObj.pathname.substring(userFilesIndex);
      } else {
        extractedPath = urlObj.pathname.replace(/^\//, "");
      }

      // Step 4: Pass server path & local preview URL to parent form
      onChange(extractedPath, previewUrl);
      toast("File uploaded!", {
        variant: "success",
        description: `${label} uploaded successfully.`,
      });
    } catch (err: any) {
      toast("Upload failed", {
        variant: "error",
        description:
          err.message || "Something went wrong while uploading file.",
      });
      setSelectedFileName(null);
      setLocalPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    onChange("", "");
    setSelectedFileName(null);
    setLocalPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5 relative group">
      <Label>{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div className="flex flex-col gap-2">
        {value ? (
          <div className="flex flex-col gap-2 p-3 rounded-md border border-border-strong bg-surface-secondary">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden text-xs">
                <span className="font-semibold text-fg-success">✓ Uploaded</span>
                <span
                  className="truncate text-content-secondary font-mono"
                  title={value}
                >
                  {selectedFileName || value}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  className="px-2 py-1 text-xs"
                  disabled={disabled || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-2 py-1 text-xs text-fg-danger hover:bg-surface-card"
                  disabled={disabled || isUploading}
                  onClick={handleClear}
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* Local Preview Thumbnail */}
            {localPreviewUrl && (
              <div className="mt-1 border border-border-subtle rounded p-1.5 bg-surface-muted max-w-xs">
                <img
                  src={localPreviewUrl}
                  alt="Local Preview"
                  className="max-h-32 w-auto object-contain rounded"
                />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => {
              if (!disabled && !isUploading) {
                fileInputRef.current?.click();
              }
            }}
            className={`flex flex-col items-center justify-center p-5 rounded-md border-2 border-dashed transition-colors cursor-pointer text-center ${
              error
                ? "border-fg-danger/60 bg-surface-card"
                : "border-border-subtle hover:border-primary/50 bg-surface-card"
            } ${disabled || isUploading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-content-primary">
                <Loader className="w-4 h-4 text-primary animate-spin" />
                <span>Uploading {selectedFileName || "file"}...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-content-primary">
                  Click to select and upload document
                </span>
                <span className="text-[10px] text-content-secondary">
                  Supported formats: JPG, PNG, WEBP (Max 5MB)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <>
          <p className="text-xs font-semibold pl-1 text-fg-danger">
            Invalid Entry
          </p>
          <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
            {error}
          </p>
        </>
      )}
    </div>
  );
}
