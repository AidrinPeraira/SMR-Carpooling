export interface TripCancellationMailDTO {
  tripId: string;
  driverName: string;
  driverEmail: string;
  cancelledBookings: {
    bookingId: string;
    passengerName: string;
    passengerEmail: string;
  }[];
}
