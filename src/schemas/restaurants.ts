import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

/**
 * Restaurant input schema
 */
export const RestaurantSchema = z
  .object({
    name: z.string().min(1).max(100).openapi({
      example: "Pizza Hut",
    }),
    cuisines: z
      .array(z.string().min(1).max(50))
      .min(1)
      .openapi({
        example: ["Italian", "Fast Food"],
      }),
    location: z.string().min(1).max(200).openapi({
      example: "Cairo, Egypt",
    }),
  })
  .openapi("Restaurant");

export type RestaurantsType = z.infer<typeof RestaurantSchema>;

/**
 * Detailed restaurant info schema
 */
export const RestaurantSchemaDetails = z
  .object({
    links: z
      .array(
        z.object({
          name: z.string().min(1).openapi({ example: "Menu" }),
          url: z.string().url().openapi({ example: "https://example.com/menu" }),
        }),
      )
      .openapi({ example: [{ name: "Menu", url: "https://example.com/menu" }] }),
    contact: z.object({
      phone: z.string().min(7).max(15).optional().openapi({ example: "+201234567890" }),
      email: z.string().email().optional().openapi({ example: "contact@example.com" }),
      website: z.string().url().optional().openapi({ example: "https://example.com" }),
    }),
  })
  .openapi("RestaurantDetails");

export type RestaurantDetailsType = z.infer<typeof RestaurantSchemaDetails>;
