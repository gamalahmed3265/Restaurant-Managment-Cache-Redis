import { validate } from "@/middlewares/validate.js";
import { RestaurantSchema, type RestaurantsType } from "@/schemas/restaurants.js";
import { getRedisClient } from "@/utils/client.js";
import { getRestaurantKey } from "@/utils/keys.js";
import express from "express";
import type { Request, Response ,NextFunction} from "express";
import { nanoid } from "nanoid";
import { successResponse } from "@/utils/responses.js";
import { checkRestaurantExists } from "@/middlewares/checkRestaurant.js";

const route=express.Router()

route.post("/",validate(RestaurantSchema),async(req: Request, res: Response,next:NextFunction)=>{
    const data=req.body as RestaurantsType;
    try {
        const client=await getRedisClient();

        const id=nanoid();
        const restaurantKey=getRestaurantKey(id);
        const hashData={
            id,
            name:data.name,
            // cuisines:data.cuisines,
            location:data.location
        }
        const addResult =await client.hSet(restaurantKey,hashData);
        console.log(`Added ${addResult} fields`);

       return successResponse(res,hashData,"Restaurant added successfully",201);
       
    } catch (error) {
        next(error);
    }
})

route.get("/:id",checkRestaurantExists,async(req: Request<{id: string}>, res: Response, next:NextFunction)=>{
    const {id}=req.params;
    
    try {
        const client=await getRedisClient();
        const restaurantKey=getRestaurantKey(id);
        const [viewCount,restaurant]=await Promise.all([
            client.hIncrBy(restaurantKey, "viewCount", 1),
            client.hGetAll(restaurantKey)
        ]);
        return successResponse(res,restaurant,"Restaurant retrieved successfully");
        
    } catch (error) {
        next(error)
    }
})

export default route;