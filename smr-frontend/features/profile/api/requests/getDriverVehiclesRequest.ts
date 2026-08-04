import { logger } from "@/lib/logger";
import { GetDriverVehiclesResult } from "@sharemyride/shared";

export async function getDriverVehiclesRequest(): Promise<GetDriverVehiclesResult[]> {
  const response = await fetch("/api/v1/vehicles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    logger.error("Failed to get driver vehicles", await response.json());
    throw new Error("Failed to fetch vehicle details");
  }

  const result = await response.json();
  return (result.payload as GetDriverVehiclesResult[]) || [];
}
