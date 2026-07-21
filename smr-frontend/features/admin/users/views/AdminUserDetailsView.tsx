import { DriverDetailsCard } from "@/features/admin/users/components/user-details/DriverDetailsCard";
import { ProfileDetailsCard } from "@/features/admin/users/components/user-details/ProfilDetailsCard";
import { TransactionDetailsCard } from "@/features/admin/users/components/user-details/TransactionDetailsCard";
import { TripDetailsCard } from "@/features/admin/users/components/user-details/TripDetailsCard";
import { VehicleDetailsCard } from "@/features/admin/users/components/user-details/VehicleDetailsCard";

export function AdminUserDetailsView() {
  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <ProfileDetailsCard />
      <DriverDetailsCard />
      <VehicleDetailsCard />
      <TripDetailsCard />
      <TransactionDetailsCard />
    </div>
  );
}
