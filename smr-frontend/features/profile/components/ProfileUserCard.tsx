import { Card, CardHeader, CardBody } from "@smr/ui";
import { GetUserResult } from "@smr/shared";
import { Edit, User } from "lucide-react";

interface Props {
  user: GetUserResult | null;
}

export function ProfileUserCard({ user }: Props) {
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Loading...";

  const defaultAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXfv-YvTpTl4yGqODU2J5oiONMAFKR4O1UZNI622ZfPxkMjmbGFErMTd7NmqjtCqFCma6vwLAMgR1sWE722kBJJi_caWoH94JN1ZUw0Pw5NUUBLn9kaQ0w3GHN4Ajp2UJDHzsRGxO9Rrf9jdRPenhOLB1NIed8Zq4Nbx8ar5_1y99jzwhlMDCRZODwbNp0x03f8kdfqz7FoT-ybZYv7I_Joad_FSm7QwqZVDKVNSEPOyYsR8l-WtmH01IQCnLNDH3N505GV57mCvoz";

  const avatarUrl = user?.profile_image || defaultAvatar;

  return (
    <Card className="p-6">
      <CardHeader className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-accent shadow-sm bg-surface-muted flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-content-tertiary" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-content-primary">
              {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent uppercase mt-1">
              {user?.user_role || "Loading..."}
            </span>
          </div>
        </div>
        <Edit className="w-5 h-5 text-content-tertiary cursor-pointer hover:text-primary transition-colors" />
      </CardHeader>
      
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0 border-t border-border-subtle pt-6">
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">First Name</label>
          <p className="text-sm font-semibold text-content-primary">
            {user?.first_name || "Loading..."}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Last Name</label>
          <p className="text-sm font-semibold text-content-primary">
            {user?.last_name || "Loading..."}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Email Address</label>
          <p className="text-sm font-semibold text-content-primary break-all">
            {user?.email_id || "Loading..."}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Phone Number</label>
          <p className="text-sm font-semibold text-content-primary">
            {user?.phone_number || "Loading..."}
          </p>
        </div>
        <div>
          <label className="block text-xs text-content-tertiary mb-1 uppercase tracking-wider font-semibold">Member Since</label>
          <p className="text-sm font-semibold text-content-primary">{memberSince}</p>
        </div>
      </CardBody>
    </Card>
  );
}
