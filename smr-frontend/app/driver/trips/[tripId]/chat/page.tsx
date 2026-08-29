import { TripChatView } from "@/features/chat/view/TripChatView";

export default async function DriverTripChatPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TripChatView chatId={resolvedParams.tripId} />
    </div>
  );
}
