import {z} from "zod";


export const RestaurantSchema = z.object({
    // id: z.string().uuid(),
    name: z.string().min(1).max(100),
    cuisine: z.string().min(1).max(50),
    location: z.string().min(1).max(200),
    // rating: z.number().min(0).max(5).optional(),
    // createdAt: z.string().optional(),
    // updatedAt: z.string().optional()
});

export const RestaurantSchemaDetailsSchema=z.object({

    links:z.array(z.object({
        name:z.string().min(1),
        url:z.string().url()
    })),
    contact:z.object({
        phone:z.string().min(7).max(15).optional(),
        email:z.string().email().optional(),
        website:z.string().url().optional()
    })

});

export type RestaurantsType=z.infer<typeof RestaurantSchema>;
export type RestaurantDetailsType=z.infer<typeof RestaurantSchemaDetailsSchema>;