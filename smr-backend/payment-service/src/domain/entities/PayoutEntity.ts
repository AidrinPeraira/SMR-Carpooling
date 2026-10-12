import { PayoutStatus } from "@sharemyride/shared";

export interface PayoutEntity {
  payoutId: string;
  tripId: string;
  bookingId: string;
  driverId: string;
  passengerId: string;
  amount: number;
  commision: number;
  payable: number;
  status: PayoutStatus;
  refTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
