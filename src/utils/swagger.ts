import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import swaggerJsdoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

import {
  RestaurantSchema,
  RestaurantSchemaDetails,
} from "@/schemas/restaurants.js";
import { ReviewsSchema } from "@/schemas/reviews.js";

const registry = new OpenAPIRegistry();

// Register schemas
registry.register("Restaurant", RestaurantSchema);
registry.register("RestaurantDetails", RestaurantSchemaDetails);
registry.register("Review", ReviewsSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
const components = generator.generateComponents();

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurants API",
      version: "1.0.0",
      description: "API documentation for Restaurants service",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}/api/v1`,
      },
    ],
    components: {
      ...components.components,
    },
  },
  apis: [
    "src/routes/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
