import { Button, Card, CardBody } from "@smr/ui";
import { Eye, UserX } from "lucide-react";

interface DriverDetailsCardProps {
  driver?: {
    dlNumber: string;
    expiryDate: string;
  } | null;
}

const MOCK_DRIVER = null;
// const MOCK_DRIVER = {
//   dlNumber: "CA-8812-990",
//   expiryDate: "12 / 2026",
// };

export function DriverDetailsCard({
  driver = MOCK_DRIVER,
}: DriverDetailsCardProps) {
  if (!driver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-8 mb-0">
          <div className="bg-surface-muted p-4 rounded-full mb-4 text-content-tertiary">
            <UserX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Not Registered as Driver
          </h3>
          <p className="text-sm text-content-secondary max-w-sm">
            This user has not registered or completed onboarding as a driver.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <CardBody className="mb-0">
        <h3 className="text-lg font-bold text-content-primary mb-6">
          Driver Profile
        </h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              DL Number
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {driver.dlNumber}
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Expiry Date
            </label>
            <p className="text-sm font-semibold text-content-primary">
              {driver.expiryDate}
            </p>
          </div>
        </div>
      </CardBody>
      <div className="mt-auto">
        <Button
          variant="secondary"
          className="flex items-center gap-1.5 text-xs py-1.5"
        >
          <Eye className="w-4 h-4" /> View DL File
        </Button>
      </div>
    </Card>
  );
}
