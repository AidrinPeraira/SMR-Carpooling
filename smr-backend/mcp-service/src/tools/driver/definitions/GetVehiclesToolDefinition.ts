import { z } from "zod";

export const GetVehiclesSchema = z.object({});

export const GetVehiclesToolDefinition = {
  title: "Get my vehicles",
  description:
    "Get the list of vehicles registered to the driver's account. Returns vehicle IDs, names, types, and status. Use this to find a vehicle ID when creating a new trip",
  inputSchema: GetVehiclesSchema,
};
