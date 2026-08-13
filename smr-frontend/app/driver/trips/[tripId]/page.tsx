import { DriverTripDetailsView } from "@/features/driver/trips/views/DriverTripDetailsView";

interface DriverTripDetailsPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function DriverTripDetailsPage({
  params,
}: DriverTripDetailsPageProps) {
  const resolvedParams = await params;
  return <DriverTripDetailsView tripId={resolvedParams.tripId} />;
}
