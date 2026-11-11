import { UserApplicationsView } from "@/features/profile";
import { Suspense } from "react";
import { Loader } from "@sharemyride/ui";

export default function ProfileApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <UserApplicationsView />
    </Suspense>
  );
}
