import { validate } from "@/middlewares/validate.js";
import { RestaurantSchema, type RestaurantsType } from "@/schemas/restaurants.js";
import { getRedisClient } from "@/utils/client.js";
import { getRestaurantKey } from "@/utils/keys.js";
import express from "express";
import type { Request, Response ,NextFunction} from "express";
import { nanoid } from "nanoid";
import { successResponse } from "@/utils/responses.js";
import { checkRestaurantExists } from "@/middlewares/checkRestaurant.js";
import { restaurantsGetById, restautantDeleteReview, restautantsCreate, restautantsReviewCreate, restautantsReviewGetReview } from "@/controller/restaurants.js";
import { ReviewsSchema } from "@/schemas/reviews.js";

const route=express.Router()

route.post("/",validate(RestaurantSchema),restautantsCreate)
route.post("/:id/reviews",checkRestaurantExists,validate(ReviewsSchema),restautantsReviewCreate);
route.get("/:id/reviews",checkRestaurantExists,restautantsReviewGetReview);
route.delete("/:id/reviews/:reviewId",checkRestaurantExists,restautantDeleteReview);
route.get("/:id",checkRestaurantExists,restaurantsGetById)

export default route;