"use client";

import { Modal } from "@sharemyride/ui";

export interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl?: string;
  details?: { label: string; value: string }[];
}

export function FilePreviewModal({
  isOpen,
  onClose,
  title,
  fileUrl,
  details,
}: FilePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-content-primary border-b border-border-subtle pb-2">
          {title}
        </h3>

        {details && details.length > 0 && (
          <div className="grid grid-cols-2 gap-3 text-xs bg-surface-muted p-3 rounded border border-border-strong">
            {details.map((item, idx) => (
              <div key={idx}>
                <span className="text-content-secondary block font-medium">
                  {item.label}
                </span>
                <span className="text-content-primary font-semibold">
                  {item.value || "—"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border border-border-strong rounded-lg p-3 bg-surface-muted flex flex-col items-center justify-center min-h-52 max-h-[60vh] overflow-auto">
          {fileUrl ? (
            fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i) ||
            !fileUrl.includes(".pdf") ? (
              <img
                src={fileUrl}
                alt={title}
                className="max-h-80 w-auto object-contain rounded shadow"
              />
            ) : (
              <iframe
                src={fileUrl}
                title={title}
                className="w-full h-80 rounded"
              />
            )
          ) : (
            <p className="text-xs text-content-secondary">No file available for preview</p>
          )}
        </div>

        {fileUrl && (
          <div className="flex justify-end">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent underline font-medium hover:text-accent/80 transition-colors"
            >
              Open Original Document &rarr;
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
