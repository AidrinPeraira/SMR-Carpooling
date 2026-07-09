import * as z from "zod";

export const ChangeUserStatusScheam = z.object({
  userId: z.hex({ message: "Invalid user ID" }).length(16),
});
