import express from "express";
import { validate } from "@/middlewares/validate.js";
import { checkRestaurantExists } from "@/middlewares/checkRestaurant.js";
import { RestaurantSchema } from "@/schemas/restaurants.js";
import { ReviewsSchema } from "@/schemas/reviews.js";

import {
  createRestaurant,
  getRestaurantById,
  createRestaurantReview,
  getRestaurantReviews,
  deleteRestaurantReview,
  getAllRestaurants,
  getRestaurantWeather,
} from "@/controller/restaurants_controller.js";

const router = express.Router();
/**
 * @swagger
 * /restaurants/:
 *   get:
 *     summary: Get restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Restaurants retrieved successfully
 */
router.get("/",getAllRestaurants)
/**
 * @swagger
 * /restaurants/{restaurantId}/weather:
 *   get:
 *     summary: Get restaurant weather by restaurant ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather retrieved successfully
 */

router.get("/:restaurantId/weather",checkRestaurantExists,getRestaurantWeather)
/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurants management
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post("/", validate(RestaurantSchema), createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant retrieved successfully
 */
router.get("/:id", checkRestaurantExists, getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}/reviews:
 *   post:
 *     summary: Create restaurant review
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post(
  "/:id/reviews",
  checkRestaurantExists,
  validate(ReviewsSchema),
  createRestaurantReview,
);

/**
 * @swagger
 * /restaurants/{id}/reviews:
 *   get:
 *     summary: Get restaurant reviews
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get(
  "/:id/reviews",
  checkRestaurantExists,
  getRestaurantReviews,
);
/**
 * @swagger
 * /restaurants/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete restaurant review
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete(
  "/:id/reviews/:reviewId",
  checkRestaurantExists,
  deleteRestaurantReview,
);

export default router;
