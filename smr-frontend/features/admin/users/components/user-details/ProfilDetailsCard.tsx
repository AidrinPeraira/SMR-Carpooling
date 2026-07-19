import { Avatar, Button, Card, CardHeader, CardBody, Tag } from "@smr/ui";
import { Ban, Mail } from "lucide-react";

const MOCK_USER = {
  firstName: "Marcus",
  lastName: "Thorne",
  userId: "#CPH-99281",
  emailId: "marcus.t@example.com",
  role: "Driver",
  phone: "+1 (555) 012-3456",
  joinedDate: "June 15, 2022",
  isActive: true,
  isEmailVerified: true,
  avatarUrl: "",
  initials: "MT",
};

export function ProfileDetailsCard() {
  return (
    <Card className="p-6">
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar
            src={MOCK_USER.avatarUrl}
            alt={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
            initials={MOCK_USER.initials}
            size="lg"
            className="w-24 h-24 rounded-full [&>div]:w-24 [&>div]:h-24 [&>div]:text-2xl shadow-sm"
          />
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-2 mt-2 sm:mt-0">
              <h2 className="text-xl font-bold text-content-primary">
                {`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
              </h2>
              <div className="flex gap-2 justify-center sm:justify-start">
                {MOCK_USER.isActive && <Tag variant="accent">Active</Tag>}
                {MOCK_USER.isEmailVerified && (
                  <Tag variant="accent">Email Verified</Tag>
                )}
              </div>
            </div>
            <p className="text-sm text-content-secondary">
              Driver ID: {MOCK_USER.userId}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-center w-full md:w-auto">
          <Button
            variant="danger"
            className="flex items-center gap-1.5 py-1.5 text-xs flex-1 md:flex-none justify-center"
          >
            <Ban className="w-3.5 h-3.5" /> Suspend
          </Button>
        </div>
      </CardHeader>

      <CardBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 border-t border-border-subtle pt-6 mb-0">
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Email ID
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {MOCK_USER.emailId}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            User ID
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {MOCK_USER.userId}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Role
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {MOCK_USER.role}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Phone
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {MOCK_USER.phone}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">
            Joined Date
          </label>
          <p className="text-sm font-semibold text-content-primary">
            {MOCK_USER.joinedDate}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
