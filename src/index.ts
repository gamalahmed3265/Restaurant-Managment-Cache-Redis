import express from "express";

import restaurantsRoute from "@/routes/restaurants.js";
import cuisinesRoute from "@/routes/cuisines.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/restaurants", restaurantsRoute);
app.use("/api/v1/cuisines", cuisinesRoute);


// 404 handler (Express 5 compatible)
app.use(errorHandler)


// Start server
app
  .listen(PORT, () => {
    console.log(`APP IS RUNNING ON PORT ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.error(`Failed TO START SERVER: ${err.message}`);
    process.exit(1);
  });
