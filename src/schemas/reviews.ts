import z from "zod";

export const ReviewsSchema = z.object({
    // restaurantId: z.string().uuid(),
    userId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional(),
    // createdAt: z.string().optional(),
    // updatedAt: z.string().optional()
});

export type ReviewsType = z.infer<typeof ReviewsSchema>;