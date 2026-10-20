import * as z from "zod";

export const ChangeUserStatusSchema = z.object({
  userId: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}-\d{8}-[0-9A-F]{6}$/, "Invalid user ID"),
});

export const ChangeUserStatusScheam = ChangeUserStatusSchema;

