import { PayoutStatus } from "../enums/PayoutEnums";
import { PaginatedPayload } from "../types";

export interface PayoutItemDTO {
  payout_id: string;
  trip_id: string;
  booking_id: string;
  driver_id: string;
  passenger_id: string;
  amount: number;
  commision: number;
  payable: number;
  status: PayoutStatus;
  ref_transaction_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface GetPayoutsResult {
  payouts: PaginatedPayload<PayoutItemDTO[]>;
}
