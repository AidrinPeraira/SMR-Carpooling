import * as z from "zod";
import { SortOrder } from "../../enums/SortEnum";

export const QuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().trim().optional(),
  searchFields: z
    .array(z.string())
    .or(z.string().transform((val) => [val]))
    .optional(),
  sortValue: z.enum(SortOrder).optional().default(SortOrder.ASC),
  sortField: z.string().trim().optional(),
  filterField: z.string().trim().optional(),
  filterValue: z.any().optional(),
});

export type QuerySchemaType = z.infer<typeof QuerySchema>;
