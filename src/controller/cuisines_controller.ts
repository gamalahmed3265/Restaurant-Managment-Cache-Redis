import type { Request, Response, NextFunction } from "express";
import { getRedisClient } from "@/utils/client.js";
import { cuisinesKey, cuisinesKeyByName, getRestaurantKey, restaurantByCuisineKeyByID, reviewKeyById, reviewsDetailsKeyByID } from "@/utils/keys.js";
import { successResponse } from "@/utils/responses.js";


export const getAllCuisines=async (  req: Request,
  res: Response,
  next: NextFunction,)=>{
    try {
        const client= await getRedisClient();
        const cuisines=await client.sMembers(cuisinesKey);
        
        return successResponse(res,cuisines);
        
    } catch (error) {
        next(error)
    }
}
export const getByIDCuisines=async (
  req: Request<{ cuisine: string }>,
  res: Response,
  next: NextFunction,
)=>{
    try {
        const {cuisine}=req.params;
        const client= await getRedisClient();
        const restaurantIDS=await client.sMembers(cuisinesKeyByName(cuisine));
        const restaurants=await Promise.all(restaurantIDS.map(resID=>
            client.hGet(getRestaurantKey(resID),"name",)
        ))
        return successResponse(res,restaurants);
        
    } catch (error) {
        next(error)
    }
}