import { validate } from "@/middlewares/validate.js";
import { RestaurantSchema, type RestaurantsType } from "@/schemas/restaurants.js";
import express from "express";
import type { Request, Response } from "express";

const route=express.Router()

route.post("/",validate(RestaurantSchema),async(req: Request, res: Response)=>{
    const data=req.body as RestaurantsType;
    return res.json(data)
})

export default route;