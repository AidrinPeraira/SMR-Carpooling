import { DriverDetailsCard } from "@/features/admin/users/components/user-details/DriverDetailsCard";
import { ProfileDetailsCard } from "@/features/admin/users/components/user-details/ProfilDetailsCard";
import { TransactionDetailsCard } from "@/features/admin/users/components/user-details/TransactionDetailsCard";
import { TripDetailsCard } from "@/features/admin/users/components/user-details/TripDetailsCard";
import { VehicleDetailsCard } from "@/features/admin/users/components/user-details/VehicleDetailsCard";

export function AdminUserDetailsView() {
  return (
    <div>
      <ProfileDetailsCard />
      <DriverDetailsCard />
      <VehicleDetailsCard />
      <TripDetailsCard />
      <TransactionDetailsCard />
    </div>
  );
}
