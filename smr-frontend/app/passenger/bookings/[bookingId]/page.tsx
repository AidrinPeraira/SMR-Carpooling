import { PassengerBookingDetailsView } from "@/features/passenger/bookings/views/PassengerBookingDetailsView";

interface PassengerBookingDetailsPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function PassengerBookingDetailsPage({
  params,
}: PassengerBookingDetailsPageProps) {
  const { bookingId } = await params;
  return <PassengerBookingDetailsView bookingId={bookingId} />;
}
