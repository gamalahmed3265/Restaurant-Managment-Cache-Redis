import type { Request, Response ,NextFunction} from "express";

import  {getRestaurantKey} from "@/utils/keys.js";
import { errorHandler } from "./errorHandler.js";
import { getRedisClient } from "@/utils/client.js";
import { errorResponse } from "@/utils/responses.js";

export const checkRestaurantExists=async(req: Request<{restaurantId: string}>, res: Response, next:NextFunction)=>{
    const {restaurantId}=req.params;
    if(!restaurantId){
        return errorResponse(res,"Restaurant ID is required",400);
    }
    const client=await getRedisClient();
    const exists=await client.exists(getRestaurantKey(restaurantId));
    if(!exists){
        errorResponse(res,"Restaurant not found",404);
    }
    next();
}