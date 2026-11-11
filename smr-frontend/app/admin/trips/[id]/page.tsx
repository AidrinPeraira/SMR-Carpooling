import { AdminTripDetailsView } from "@/features/admin/trips/views/AdminTripDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminTripDetailsPage({ params }: Props) {
  const { id } = await params;
  return <AdminTripDetailsView tripId={id} />;
}
