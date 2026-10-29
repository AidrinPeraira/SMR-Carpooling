import { GetJourneyDetailsSchema } from "@sharemyride/shared";

export const GetJourneyDetailsToolDefinition = {
  title: "Get trip fare and route details",
  description:
    "Get the fare estimate, route, and stop details for a trip before booking. Use this after searching for trips to show the passenger pricing and route information",
  inputSchema: GetJourneyDetailsSchema,
};
