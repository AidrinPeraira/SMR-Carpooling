import { DriverBookingDetailsView } from "@/features/driver/bookings/views/DriverBookingDetailsView";

interface PageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function DriverBookingDetailsPage({ params }: PageProps) {
  const { bookingId } = await params;
  return <DriverBookingDetailsView bookingId={bookingId} />;
}
