import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ReviewsSchema = z
  .object({
    rating: z.number().min(1).max(5).openapi({ example: 5 }),
    review: z.string().max(500).optional().openapi({
      example: "Amazing food!",
    }),
  })
  .openapi("Review");

export type ReviewsType = z.infer<typeof ReviewsSchema>;
