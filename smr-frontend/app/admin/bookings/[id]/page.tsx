import { AdminBookingDetailsView } from "@/features/admin/bookings/views/AdminBookingDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBookingDetailsPage({ params }: Props) {
  const { id } = await params;
  return <AdminBookingDetailsView bookingId={id} />;
}
