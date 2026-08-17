import { PaymentMethod, TransactionStatus } from "@sharemyride/shared";

export interface BookingPaymentEntity {
  id: string;
  paymentId: string;
  bookingId: string;
  passengerId: string;
  gatewayTransactionId: string;
  paymentMethod: PaymentMethod;
  idempotencyKey: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
