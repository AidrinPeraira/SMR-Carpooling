import { logger } from "@/lib/logger";
import { GetDriverDetailsResult } from "@sharemyride/shared";

export async function getDriverDetailsRequest(): Promise<GetDriverDetailsResult | null> {
  const response = await fetch("/api/v1/driver/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    logger.error("Failed to get driver details", await response.json());
    throw new Error("Failed to fetch driver details");
  }

  const result = await response.json();
  return (result.payload as GetDriverDetailsResult) || null;
}
