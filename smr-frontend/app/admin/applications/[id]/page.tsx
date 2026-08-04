import { AdminApplicationDetailsView } from "@/features/admin/applications";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminApplicationDetailsPage({ params }: Props) {
  const { id } = await params;
  return <AdminApplicationDetailsView applicationId={id} />;
}
