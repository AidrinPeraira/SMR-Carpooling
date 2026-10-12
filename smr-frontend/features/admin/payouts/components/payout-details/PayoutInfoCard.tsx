"use client";

import { InlineError } from "@/components/InlineError";
import { getPayoutDetailsRequest } from "@/features/admin/payouts/api/requests/getPayoutDetailsRequest";
import { approvePayoutRequest } from "@/features/admin/payouts/api/requests/approvePayoutRequest";
import { PayoutStatus } from "@sharemyride/shared";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  Loader,
  Tag,
  useToast,
} from "@sharemyride/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface PayoutInfoCardProps {
  payoutId: string;
}

export function PayoutInfoCard({ payoutId }: PayoutInfoCardProps) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    header: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    header: "",
    description: "",
    onConfirm: () => {},
  });

  const { isPending, data, error } = useQuery({
    queryKey: ["payoutDetails", payoutId],
    queryFn: async () => getPayoutDetailsRequest(payoutId),
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
  });

  const approveMutation = useMutation({
    mutationFn: approvePayoutRequest,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["payoutDetails", payoutId],
        });
        queryClient.invalidateQueries({ queryKey: ["allPayouts"] });
        toast("Payout completed and credited to wallet", {
          variant: "success",
        });
      } else {
        toast(res.message || "Failed to process payout", { variant: "error" });
      }
    },
    onError: (err) => {
      toast(err?.message || "Failed to process payout", { variant: "error" });
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <InlineError message={`Some error occurred : ${error}`}></InlineError>
    );
  }

  if (!data?.success || !data?.payload) {
    return (
      <InlineError
        message={`Some response error occurred : ${data?.message || "Invalid payload"}`}
      ></InlineError>
    );
  }

  const payout = data.payload.payout;

  const getStatusTag = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.PENDING:
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border border-warning-border uppercase tracking-wider"
          >
            Pending
          </Tag>
        );
      case PayoutStatus.COMPLETED:
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Completed
          </Tag>
        );
      default:
        return (
          <Tag variant="muted" className="uppercase tracking-wider">
            {status}
          </Tag>
        );
    }
  };

  const formattedDate = new Date(payout.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const handleApproveClick = () => {
    setDialogState({
      isOpen: true,
      header: "Process Payout",
      description: `Are you sure you want to process this payout of ₹${payout.payable.toFixed(2)} for driver ${payout.driver_id}? This will credit the amount to the driver's wallet.`,
      onConfirm: () => {
        approveMutation.mutate(payoutId);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <>
      <Card className="p-6">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-2">
              <h2 className="text-xl font-bold text-content-primary">
                Payout Details
              </h2>
              {getStatusTag(payout.status)}
            </div>
            <p className="text-sm text-content-secondary">
              Payout ID: {payout.payout_id}
            </p>
          </div>

          <div className="flex gap-3 justify-center w-full md:w-auto">
            {payout.status === PayoutStatus.PENDING && (
              <Button
                variant="primary"
                className="flex items-center gap-1.5 py-1.5 text-xs flex-1 md:flex-none justify-center min-w-[120px]"
                disabled={approveMutation.isPending}
                onClick={handleApproveClick}
              >
                {approveMutation.isPending ? (
                  <Loader className="w-3.5 h-3.5 border-t-white" />
                ) : (
                  "Process Payout"
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6 mb-0">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Trip ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {payout.trip_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Booking ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {payout.booking_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Driver ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {payout.driver_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Passenger ID
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {payout.passenger_id}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Amount
            </label>
            <p className="text-sm font-semibold text-content-primary">
              ₹{payout.amount.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Commission
            </label>
            <p className="text-sm font-semibold text-content-primary">
              ₹{payout.commision.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Payable to Driver
            </label>
            <p className="text-sm font-semibold text-content-primary">
              ₹{payout.payable.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Created At
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {formattedDate}
            </p>
          </div>
          {payout.ref_transaction_id && (
            <div>
              <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
                Transaction ID
              </label>
              <p className="text-sm font-semibold text-content-primary">
                {payout.ref_transaction_id}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        header={dialogState.header}
        description={dialogState.description}
        confirmAction={dialogState.onConfirm}
        rejectAction={() =>
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </>
  );
}
