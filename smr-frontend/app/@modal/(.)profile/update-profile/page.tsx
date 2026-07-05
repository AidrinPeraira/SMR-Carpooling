import { ProfileUpdateForm } from "@/features/profile/forms/ProfileUpdateForm";
import { Modal } from "@smr/ui";

export default function UpdateProfileModal() {
  return (
    <Modal>
      <ProfileUpdateForm className="w-full" />
    </Modal>
  );
}
