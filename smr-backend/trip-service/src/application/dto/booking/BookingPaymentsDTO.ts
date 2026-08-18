export interface InitaiteBookingPaymentResponseDTO {
  passengerId: string;
  tansactionKey: string;
  bookingId: string;
  expiresAt: Date;
}

export interface CleanUpBookingRequsetDTO {
  bookingId: string;
  tripId: string;
  paymentKey: string;
}
