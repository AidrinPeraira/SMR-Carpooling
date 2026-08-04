import * as z from "zod";
import { ApplicationStatus } from "../../enums";

export const ProcessApplicationSchema = z.object({
  application_id: z.string().trim().min(1, "Application ID is required"),
  application_status: z.enum(ApplicationStatus),
  admin_comment: z.object({
    comment: z.string().trim().min(1, "Admin comment is required"),
  }),
});

export type ProcessApplicationSchemaType = z.infer<typeof ProcessApplicationSchema>;
