import { Modal } from "@sharemyride/ui";
import { TripChatView } from "@/features/chat/view/TripChatView";

export default async function PassengerBookingChatDialog({ searchParams }: { searchParams: Promise<{ tripId: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Modal className="p-0 overflow-hidden sm:max-w-2xl w-full h-[80vh]">
      <TripChatView chatId={resolvedSearchParams.tripId} />
    </Modal>
  );
}
