import { ProfileDriverCard } from "@/features/profile/components/ProfileDriverCard";
import { ProfileUserCard } from "@/features/profile/components/ProfileUserCard";
import { ProfileVehiclesCard } from "@/features/profile/components/ProfileVehiclesCard";
import { apiServerFetch } from "@/lib/api-server";

export async function ProfilePageView() {
  let user = null;

  try {
    const response = await apiServerFetch("/api/v1/profile");
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        user = result.payload;
      }
    }
  } catch (err) {
    // Graceful fallback to null user
  }

  return (
    <div className="p-8 py-6 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">Profile Overview</h1>
        <p className="text-content-secondary mt-1">
          Manage your personal information and trip preferences.
        </p>
      </header>

      <div className="max-w-4xl flex flex-col gap-6 w-full">
        <ProfileUserCard user={user} />
        <ProfileDriverCard user={user} />
        <ProfileVehiclesCard user={user} />
      </div>
    </div>
  );
}
