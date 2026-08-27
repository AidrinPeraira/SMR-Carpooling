import { PaymentMethod, TransactionStatus } from "@sharemyride/shared";

export interface BookingPaymentEntity {
  id: string;
  bookingId: string;
  passengerId: string;

  amount: number;
  paymentKey: string;

  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewayVeificationKey?: string;

  paymentMethod: PaymentMethod;
  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
}
