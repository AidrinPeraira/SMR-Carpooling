import { AdminVehicleDetailsView } from "@/features/admin/vehicles/views/AdminVehicleDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminVehicleDetailsPage({ params }: Props) {
  const { id } = await params;
  return <AdminVehicleDetailsView vehicleId={id} />;
}
