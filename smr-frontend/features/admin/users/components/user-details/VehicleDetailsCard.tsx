import { Card, CardBody, Tag } from "@smr/ui";
import { Car } from "lucide-react";

interface Vehicle {
  name: string;
  licensePlate: string;
  status: string;
  rc: string;
  insurance: string;
}

interface VehicleDetailsCardProps {
  vehicles?: Vehicle[] | null;
}

const MOCK_VEHICLES = null;

// const MOCK_VEHICLES: Vehicle[] = [
//   {
//     name: "Tesla Model 3 (Midnight Grey)",
//     licensePlate: "ABC-1234",
//     status: "Active",
//     rc: "ABC-RC-99281 (Exp: 10/2028)",
//     insurance: "INS-8821 (Exp: 05/2024)",
//   },
//   {
//     name: "Chevrolet Bolt EV (Summit White)",
//     licensePlate: "XYZ-5678",
//     status: "Active",
//     rc: "XYZ-RC-44120 (Exp: 04/2029)",
//     insurance: "INS-9901 (Exp: 08/2025)",
//   },
//   {
//     name: "Nissan Leaf (Deep Blue)",
//     licensePlate: "MNO-9012",
//     status: "Inactive",
//     rc: "MNO-RC-33291 (Exp: 11/2027)",
//     insurance: "INS-4452 (Exp: 02/2024)",
//   },
// ];
//
export function VehicleDetailsCard({
  vehicles = MOCK_VEHICLES,
}: VehicleDetailsCardProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-8 mb-0">
          <div className="bg-surface-muted p-4 rounded-full mb-4 text-content-tertiary">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            No Vehicles Registered
          </h3>
          <p className="text-sm text-content-secondary max-w-sm">
            This user has not registered any vehicles on the platform yet.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <h3 className="text-lg font-bold text-content-primary mb-6">
          Registered Vehicles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="p-4 border border-border-subtle rounded-lg bg-surface-muted/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-sm text-content-primary">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-content-secondary font-medium mt-0.5">
                      {vehicle.licensePlate}
                    </p>
                  </div>
                  <Tag
                    variant={vehicle.status === "Active" ? "accent" : "muted"}
                    className={
                      vehicle.status === "Active"
                        ? "bg-accent text-accent-fg uppercase tracking-wider"
                        : "uppercase tracking-wider"
                    }
                  >
                    {vehicle.status}
                  </Tag>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs text-content-secondary mb-4 border-t border-border-subtle pt-4">
                  <div>
                    <span className="text-content-tertiary font-bold uppercase tracking-wider">
                      RC:
                    </span>{" "}
                    {vehicle.rc}
                  </div>
                  <div>
                    <span className="text-content-tertiary font-bold uppercase tracking-wider">
                      Insurance:
                    </span>{" "}
                    {vehicle.insurance}
                  </div>
                </div>
              </div>

              <button className="text-accent font-bold text-xs hover:underline uppercase tracking-wider cursor-pointer text-left w-fit">
                View Files
              </button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
