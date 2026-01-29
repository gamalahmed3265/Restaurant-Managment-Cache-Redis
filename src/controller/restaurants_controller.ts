import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import { getRedisClient } from "@/utils/client.js";
import { cuisinesKey, cuisinesKeyByName, getRestaurantKey, restaurantByCuisineKeyByID, reviewKeyById, reviewsDetailsKeyByID } from "@/utils/keys.js";
import { successResponse, errorResponse } from "@/utils/responses.js";
import { paginateFunctions } from "@/utils/pageination.js";
import type { ReviewsType } from "@/schemas/reviews.js";
import type { RestaurantsType } from "@/schemas/restaurants.js";



export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body as RestaurantsType;
    const client = await getRedisClient();

    const id = nanoid();
    const restaurantKey = getRestaurantKey(id);

    const hashData = {
      id,
      name: data.name,
      location: data.location,
      };
     await Promise.all([
        ...data.cuisines.map(cuisine => 
          Promise.all([
            client.sAdd(cuisinesKey, cuisine),
            client.sAdd(cuisinesKeyByName(cuisine), id),
            client.sAdd(restaurantByCuisineKeyByID(id), cuisine),
          ])
        )
      ])
    await client.hSet(restaurantKey, hashData);

    return successResponse(res, hashData, "Restaurant created", 201);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const client = await getRedisClient();
    const restaurantKey = getRestaurantKey(id);

    const [viewCount, restaurant,cuisines] = await Promise.all([
      client.hIncrBy(restaurantKey, "viewCount", 1),
      client.hGetAll(restaurantKey),
      client.sMembers(restaurantByCuisineKeyByID(id))
    ]);

    return successResponse(res, {...restaurant,cuisines}, "Restaurant retrieved");
  } catch (error) {
    next(error);
  }
};

export const createRestaurantReview = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = req.body as ReviewsType;
    const client = await getRedisClient();

    const reviewId = nanoid();
    const reviewKey = reviewKeyById(id);
    const reviewDetailsKey = reviewsDetailsKeyByID(reviewId);

    const hashData = {
      restaurant_id: id,
      review_id: reviewId,
      timestamp: Date.now(),
      ...data,
    };

    await Promise.all([
      client.lPush(reviewKey, reviewId),
      client.hSet(reviewDetailsKey, hashData),
    ]);

    return successResponse(res, hashData, "Review added", 201);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantReviews = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    const { startIndex, endIndex } = paginateFunctions(page, limit);

    const client = await getRedisClient();
    const reviewKey = reviewKeyById(id);

    const reviewIds = await client.lRange(reviewKey, startIndex, endIndex);
    const reviews = await Promise.all(
      reviewIds.map((r) => client.hGetAll(reviewsDetailsKeyByID(r))),
    );

    return successResponse(res, reviews, "Reviews retrieved");
  } catch (error) {
    next(error);
  }
};


export const deleteRestaurantReview = async (
  req: Request<{ id: string; reviewId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, reviewId } = req.params;
    const client = await getRedisClient();

    const [removed, deleted] = await Promise.all([
      client.lRem(reviewKeyById(id), 0, reviewId),
      client.del(reviewsDetailsKeyByID(reviewId)),
    ]);

    if (!removed && !deleted) {
      return errorResponse(res, "Review not found", 404);
    }

    return successResponse(res, null, "Review deleted");
  } catch (error) {
    next(error);
  }
};
