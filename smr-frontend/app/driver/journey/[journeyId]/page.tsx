import { DriverJourneyView } from "@/features/driver/journey/views/DiverJourneyView";

interface DriverJourneyPageProps {
  params: Promise<{
    journeyId: string;
  }>;
}

export default async function DriverJourneyPage({
  params,
}: DriverJourneyPageProps) {
  const resolvedParams = await params;
  return <DriverJourneyView journeyId={resolvedParams.journeyId} />;
}
