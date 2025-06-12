import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllFiles,
  deleteFile,
  getStorageUsage,
  getAllCharts,
  getChartStats,
  getChartById,
  deleteChart,
  bulkDeleteCharts,
  getDashboardOverview,
} from "../controllers/adminController.js";

import auth from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Admin dashboard stats
router.get("/stats", auth, isAdmin, getDashboardStats);

// User management
router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/users/:userId", auth, isAdmin, deleteUser);

// File management
router.get("/files", auth, isAdmin, getAllFiles);
router.delete("/files/:fileId", auth, isAdmin, deleteFile);

// Storage usage
router.get("/storage", auth, isAdmin, getStorageUsage);

// Chart statistics route
router.get("/charts/stats", auth, isAdmin, getChartStats);

// Get all charts with pagination and filtering
router.get("/charts", auth, isAdmin, getAllCharts);

// Get specific chart by ID
router.get("/charts/:chartId", auth, isAdmin, getChartById);

// Delete specific chart
router.delete("/charts/:chartId", auth, isAdmin, deleteChart);

// Bulk delete charts
router.delete("/charts", auth, isAdmin, bulkDeleteCharts);

// Get chart analytics dashboard
router.get("/dashboard", auth, isAdmin, getDashboardOverview);

export default router;
