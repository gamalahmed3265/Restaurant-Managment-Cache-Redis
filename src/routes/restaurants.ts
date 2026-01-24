import express from "express";
import type { Request, Response } from "express";

const route=express.Router()

route.get("/",(req: Request, res: Response)=>{
    res.send("Cuisines route")
})

export default route;