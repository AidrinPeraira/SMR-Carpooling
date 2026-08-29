import { TripChatView } from "@/features/chat/view/TripChatView";

export default async function PassengerBookingChatPage({ searchParams }: { searchParams: Promise<{ tripId: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TripChatView chatId={resolvedSearchParams.tripId} />
    </div>
  );
}
