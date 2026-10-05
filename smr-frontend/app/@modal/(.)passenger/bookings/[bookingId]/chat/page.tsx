import { TripChatView } from "@/features/chat/view/ChatView";
import { Modal } from "@sharemyride/ui";

export default function PassengerBookingChatDialog() {
  return (
    <Modal className="p-6 sm:max-w-2xl w-full">
      <TripChatView />
    </Modal>
  );
}
