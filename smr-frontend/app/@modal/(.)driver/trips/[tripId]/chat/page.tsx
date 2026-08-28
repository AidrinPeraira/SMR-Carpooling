import { Modal } from "@sharemyride/ui";
import { TripChatView } from "@/features/chat/view/TripChatView";

export default async function DriverTripChatModal({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = await params;
  return (
    <Modal className="p-0 overflow-hidden sm:max-w-2xl w-full h-[80vh]">
      <TripChatView chatId={resolvedParams.tripId} />
    </Modal>
  );
}
