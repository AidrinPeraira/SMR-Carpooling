import { UserApplicationDetailsView } from "@/features/profile";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserApplicationDetailsPage({ params }: Props) {
  const { id } = await params;
  return <UserApplicationDetailsView applicationId={id} />;
}
