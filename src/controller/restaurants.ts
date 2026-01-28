import { type RestaurantsType } from "@/schemas/restaurants.js";
import { getRedisClient } from "@/utils/client.js";
import {
  getRestaurantKey,
  reviewKeyById,
  reviewsDetailsKeyByID,
} from "@/utils/keys.js";
import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import { errorResponse, successResponse } from "@/utils/responses.js";
import { checkRestaurantExists } from "@/middlewares/checkRestaurant.js";
import type { ReviewsType } from "@/schemas/reviews.js";
import { paginateFunctions } from "@/utils/pageination.js";

export const restautantsCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = req.body as RestaurantsType;
  try {
    const client = await getRedisClient();

    const id = nanoid();
    const restaurantKey = getRestaurantKey(id);
    const hashData = {
      id,
      name: data.name,
      // cuisines:data.cuisines,
      location: data.location,
    };
    const addResult = await client.hSet(restaurantKey, hashData);
    console.log(`Added ${addResult} fields`);

    return successResponse(res, hashData, "Restaurant added successfully", 201);
  } catch (error) {
    next(error);
  }
};
export const restaurantsGetById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const client = await getRedisClient();
    const restaurantKey = getRestaurantKey(id);
    const [viewCount, restaurant] = await Promise.all([
      client.hIncrBy(restaurantKey, "viewCount", 1),
      client.hGetAll(restaurantKey),
    ]);
    return successResponse(
      res,
      restaurant,
      "Restaurant retrieved successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const restautantsReviewCreate = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const data = req.body as ReviewsType;
  try {
    const client = await getRedisClient();

    const review_id = nanoid();
    const reviewKey = reviewKeyById(id);
    const reviewDetailsKey = reviewsDetailsKeyByID(review_id);
    const hashData = {
      restaurant_id: id,
      review_id,
      reviewDetailsKey,
      timestamp: Date.now(),
      ...data,
      // comment:data.comment,
    };

    await Promise.all([
      client.lPush(reviewKey, review_id),
      client.hSet(reviewDetailsKey, hashData),
    ]);

    return successResponse(res, hashData, "Review added successfully", 201);
  } catch (error) {
    next(error);
  }
};
export const restautantsReviewGetReview = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query as {
    page?: number;
    limit?: number;
  };

  const { startIndex, endIndex } = paginateFunctions(page, limit);
  try {
    const client = await getRedisClient();

    const reviewKey = reviewKeyById(id);
    const reviewIds = await client.lRange(reviewKey, startIndex, endIndex);
    // const pipeline = client.multi();

    // reviewIds.forEach((reviewId) => {
    //   pipeline.hGetAll(reviewsDetailsKeyByID(reviewId));
    // });

    // const reviews = await pipeline.exec();

    const reviews= await Promise.all(
      reviewIds.map(async (reviewId) => {
        return await client.hGetAll(reviewsDetailsKeyByID(reviewId));
      }),
    );
    return successResponse(res, reviews, "Reviews retrieved successfully", 200);
  } catch (error) {
    next(error);
  }
};
export const restautantDeleteReview = async (
  req: Request<{ id: string; reviewId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id, reviewId } = req.params;

    try {
    const client = await getRedisClient();
    const reviewKey = reviewKeyById(id);
    const reviewDetailsKey = reviewsDetailsKeyByID(reviewId);
    const [removeReluts,deleteResults]=await Promise.all([
      client.lRem(reviewKey, 0, reviewId),
      client.del(reviewDetailsKey),
    ]);
    if(removeReluts===0 && deleteResults===0){
        return errorResponse(res,"Review not found",404);
    }
    return successResponse(res, null, "Review deleted successfully", 200);
    } catch (error) {
    next(error);
    }
};
export const restaurantsGetByIdReviews = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const client = await getRedisClient();
    const restaurantKey = getRestaurantKey(id);
    const [viewCount, restaurant] = await Promise.all([
      client.hIncrBy(restaurantKey, "viewCount", 1),
      client.hGetAll(restaurantKey),
    ]);
    return successResponse(
      res,
      restaurant,
      "Restaurant retrieved successfully",
    );
  } catch (error) {
    next(error);
  }
};

