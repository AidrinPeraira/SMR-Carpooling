import { Card, CardBody } from "@smr/ui";
import { GetUserResult, UserRole } from "@smr/shared";

interface Props {
  user: GetUserResult | null;
}

export function ProfileVehiclesCard({ user }: Props) {
  const isDriver = user?.user_role === UserRole.DRIVER || user?.user_role === UserRole.ADMIN;

  if (!isDriver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-4 mb-0">
          <h3 className="text-lg font-bold text-content-primary mb-2">Vehicle Details</h3>
          <p className="text-sm text-content-secondary">
            Register as a driver to add and manage your vehicles.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-content-primary">Vehicle Details</h3>
          <div className="flex gap-3">
            <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
            <button className="text-xs font-semibold text-accent hover:underline">Edit Details</button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="aspect-video rounded-lg overflow-hidden border border-border-strong bg-surface-muted flex items-center justify-center">
              <span className="text-3xl">🚗</span>
            </div>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Vehicle</label>
              <p className="text-sm font-semibold text-content-primary">Tesla Model 3 (2023)</p>
            </div>
            <div>
              <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Color</label>
              <p className="text-sm font-semibold text-content-primary">Pearl White</p>
            </div>
            <div>
              <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">License Plate</label>
              <p className="text-sm font-semibold text-content-primary">NYC-7890</p>
            </div>
            <div>
              <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Insurance Expiry</label>
              <p className="text-sm font-semibold text-content-primary">Oct 2025</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
