import * as z from "zod";

export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{32}$/, "Invalid user ID"),
});

export type UserIdParamSchemaType = z.infer<typeof UserIdParamSchema>;
