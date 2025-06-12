// routes/chart.routes.js

import { Router } from "express";
import auth from "../middlewares/auth.middlewares.js";
import {
  createChart,
  getUserCharts,
  getChart,
} from "../controllers/chartController.js";

const router = Router();

// Create new chart
router.post("/", auth, createChart);

// Get user's charts
router.get("/", auth, getUserCharts);

// Get specific chart
router.get("/:chartId", auth, getChart);

export default router;
