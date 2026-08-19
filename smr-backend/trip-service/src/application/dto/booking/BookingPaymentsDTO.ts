export interface InitaiteBookingPaymentResponseDTO {
  paymentToken: string;
}

export interface CleanUpBookingRequsetDTO {
  bookingId: string;
  tripId: string;
  paymentKey: string;
}
