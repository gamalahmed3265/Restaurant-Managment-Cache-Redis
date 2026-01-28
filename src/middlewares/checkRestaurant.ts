import type { Request, Response ,NextFunction} from "express";

import  {getRestaurantKey} from "@/utils/keys.js";
import { errorHandler } from "./errorHandler.js";
import { getRedisClient } from "@/utils/client.js";
import { errorResponse } from "@/utils/responses.js";

export const checkRestaurantExists=async(req: Request<{id: string}>, res: Response, next:NextFunction)=>{
    const {id}=req.params;
    if(!id){
        return errorResponse(res,"Restaurant ID is required",400);
    }
    const client=await getRedisClient();
    const exists=await client.exists(getRestaurantKey(id));
    if(!exists){
        errorResponse(res,"Restaurant not found",404);
    }
    next();
}