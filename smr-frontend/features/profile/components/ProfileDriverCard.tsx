import { Button, Card, CardBody } from "@smr/ui";
import { GetUserResult } from "@smr/shared";
import { Check, Link } from "lucide-react";

interface Props {
  user: GetUserResult | null;
}

export function ProfileDriverCard({ user }: Props) {
  if (!user || !user.is_driver) {
    return (
      <Card className="p-6">
        <CardBody className="flex flex-col items-center text-center py-4 mb-0">
          <div className="bg-primary-container/10 p-3 rounded-full mb-4">
            <span className="text-primary text-2xl font-bold">🚗</span>
          </div>
          <h3 className="text-lg font-bold text-content-primary mb-2">
            Become a Driver
          </h3>
          <p className="text-sm text-content-secondary mb-6 max-w-md">
            Interested in earning? Join our community of verified drivers to
            start offering rides.
          </p>
          <Link href="/application/onboard">
            <Button variant="primary">Get Started</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-bold text-content-primary">
            Driver Information
          </h3>
          <span className="bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
            <Check className="w-3 h-3 text-primary" />
            VERIFIED DRIVER
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Active Since
            </label>
            <p className="text-sm font-semibold text-content-primary">
              March 2023
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              DL Number
            </label>
            <p className="text-sm font-semibold text-content-primary">
              •••• •••• 5678
            </p>
          </div>
          <div>
            <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
              Valid Till
            </label>
            <p className="text-sm font-semibold text-content-primary">
              Dec 2028
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
