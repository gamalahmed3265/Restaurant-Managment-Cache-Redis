import { getAllCuisines, getByIDCuisines } from "@/controller/cuisines_controller.js";
import express from "express";

const route=express.Router()

/**
 * @swagger
 * /cuisines/:
 *   get:
 *     summary: Get All cuisines
 *     tags: [Cuisines]
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 */
route.get("/",getAllCuisines)
/**
 * @swagger
 * /cuisines/{cuisine}:
 *   get:
 *     summary: Get cuisine by cuisine
 *     tags: [Cuisines]
 *     parameters:
 *       - in: path
 *         name: cuisine
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 */
route.get("/:cuisine",getByIDCuisines)
export default route;