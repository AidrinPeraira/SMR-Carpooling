import { ProfileUpdateForm } from "@/features/profile/forms/ProfileUpdateForm";

export function ProfileUpdateView() {
  return (
    <div className="w-full h-full flex items-center justify-center mx-auto max-w-md">
      <ProfileUpdateForm className="w-full px-4 py-6 mx-3 my-auto" />
    </div>
  );
}
