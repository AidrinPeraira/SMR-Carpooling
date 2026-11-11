"use client";

import { Card, Tag } from "@sharemyride/ui";

interface AdminComment {
  comment: string;
  admin_id: string;
  time: Date | string;
}

interface Props {
  comments?: AdminComment[];
}

export function AdminReturnBanner({ comments }: Props) {
  if (!comments || comments.length === 0) return null;

  return (
    <Card className="border-amber-500/50 bg-amber-50/10 mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Tag variant="accent">ACTION REQUIRED</Tag>
        <h4 className="text-sm font-bold text-amber-500">
          Application Returned by Admin
        </h4>
      </div>
      <p className="text-xs text-content-secondary mb-3">
        Please review the admin notes below, make necessary updates, and resubmit your application.
      </p>
      <div className="flex flex-col gap-2">
        {comments.map((c, index) => (
          <div
            key={index}
            className="p-2 rounded bg-surface-muted border border-border-strong text-xs text-content-primary"
          >
            <span className="font-semibold text-content-secondary">
              {new Date(c.time).toLocaleDateString()}:{" "}
            </span>
            <span>{c.comment}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
