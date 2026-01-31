import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import { getRedisClient } from "@/utils/client.js";
import { cuisinesKey, cuisinesKeyByName, getRestaurantKey, restaurantByCuisineKeyByID, restaurantsByRatingKey, reviewKeyById, reviewsDetailsKeyByID, weatherKeyById } from "@/utils/keys.js";
import { successResponse, errorResponse } from "@/utils/responses.js";
import { paginateFunctions } from "@/utils/pageination.js";
import type { ReviewsType } from "@/schemas/reviews.js";
import type { RestaurantsType } from "@/schemas/restaurants.js";
import { fetchWeatherData } from "@/utils/weather.js";

export const getAllRestaurants=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {page,limit}=req.query as any;
    const client=await getRedisClient();
    const {startIndex,endIndex}=paginateFunctions(page,limit)
    const restaurantsIDs=await client.zRange(restaurantsByRatingKey,startIndex,endIndex,{
      REV:true
    });
    const restaurants=await Promise.all(
      restaurantsIDs.map(async (id) => {
        const restaurantKey = getRestaurantKey(id);
        return client.hGetAll(restaurantKey)
      })
    )
    return successResponse(res,restaurants)
  } catch (error) {
    next(error)
  }
}
export const getRestaurantWeather=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {restaurantId}=req.params as {restaurantId:string};
    const client=await getRedisClient();
    const weatherKey=weatherKeyById(restaurantId);
    const cachedWeather=await client.get(weatherKey);
    if(cachedWeather){
      return successResponse(res,JSON.parse(cachedWeather))
    }
    const restaurantKey=getRestaurantKey(restaurantId);
    const coodrs=await client.hGet(restaurantKey,"location") ;
    if(!coodrs){
      return errorResponse(res,"Location not found for restaurant",404);
    }
    const weatherData= await fetchWeatherData(coodrs);
    await client.setEx(weatherKey,3600,JSON.stringify(weatherData));
    return successResponse(res,weatherData)
  } catch (error) {
    next(error)
  }
}

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

    client.zAdd(restaurantsByRatingKey, { score: 0, value: id });

    return successResponse(res, hashData, "Restaurant created", 201);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId } = req.params;
    const client = await getRedisClient();
    const restaurantKey = getRestaurantKey(restaurantId);

    const [viewCount, restaurant,cuisines] = await Promise.all([
      client.hIncrBy(restaurantKey, "viewCount", 1),
      client.hGetAll(restaurantKey),
      client.sMembers(restaurantByCuisineKeyByID(restaurantId))
    ]);

    return successResponse(res, {...restaurant,cuisines}, "Restaurant retrieved");
  } catch (error) {
    next(error);
  }
};

export const createRestaurantReview = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId } = req.params;
    const data = req.body as ReviewsType;
    const client = await getRedisClient();

    const reviewId = nanoid();
    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewsDetailsKeyByID(reviewId);
    const restaurantKey=getRestaurantKey(restaurantId)
    const hashData = {
      restaurant_id: restaurantId,
      review_id: reviewId,
      timestamp: Date.now(),
      ...data,
    };

    const [reviewCount,setResult,totalStars]=await Promise.all([
      client.lPush(reviewKey, reviewId),
      client.hSet(reviewDetailsKey, hashData),
      client.hIncrByFloat(restaurantKey,"totalStars",data.rating)
    ]);
    const avarageRating=Number((+totalStars/reviewCount).toFixed(1));

    await Promise.all(
    [  client.zAdd(restaurantsByRatingKey,{
        score:avarageRating,
        value:restaurantId
      }),
      client.hSet(restaurantKey,"avarageRating",avarageRating)

    ]
    )
    return successResponse(res, hashData, "Review added", 201);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantReviews = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    const { startIndex, endIndex } = paginateFunctions(page, limit);

    const client = await getRedisClient();
    const reviewKey = reviewKeyById(restaurantId);

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
  req: Request<{ restaurantId: string; reviewId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const client = await getRedisClient();

    const [removed, deleted] = await Promise.all([
      client.lRem(reviewKeyById(restaurantId), 0, reviewId),
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
