import { validate } from "@/middlewares/validate.js";
import { RestaurantSchema, type RestaurantsType } from "@/schemas/restaurants.js";
import { getRedisClient } from "@/utils/client.js";
import express from "express";
import type { Request, Response } from "express";
import { get } from "node:http";

const route=express.Router()

route.post("/",validate(RestaurantSchema),async(req: Request, res: Response)=>{
    const data=req.body as RestaurantsType;
    const client=await getRedisClient();
    
    return res.json({message:"Restaurant added successfully"})
})

route.get("/:id",async(req: Request, res: Response)=>{
    const {id}=req.params;
    const client=await getRedisClient();
    const data=await client.hGetAll(`restaurant:${id}`);
    return res.json(data)
})

export default route;