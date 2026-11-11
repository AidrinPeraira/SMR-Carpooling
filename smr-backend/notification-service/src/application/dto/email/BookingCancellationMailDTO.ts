export interface BookingCancellationMailDTO {
  bookingId: string;
  passengerName: string;
  passengerEmail: string;
  driverName: string;
  driverEmail: string;
  bookingStart: string;
  bookingStop: string;
  amount: string;
}
