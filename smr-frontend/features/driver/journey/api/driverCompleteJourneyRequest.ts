import { apiClientFetch } from "@/lib/api-client";

export async function driverCompleteJourneyRequest(
  journeyId: string,
): Promise<void> {
  const response = await apiClientFetch<null>(
    `/api/v1/journey/${journeyId}/complete`,
    {
      method: "PATCH",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to complete journey");
  }
}
