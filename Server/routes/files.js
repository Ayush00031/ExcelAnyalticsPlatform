import express from "express";
import auth from "../middlewares/auth.middlewares.js";
import {
  upload,
  uploadExcelFile,
  getUserFiles,
  getFileData,
  getRecentActivity,
} from "../controllers/fileController.js";

const router = express.Router();

//upload excel file
router.post("/upload", auth, upload.single("excel"), uploadExcelFile);

// Get user's uploaded files
router.get("/", auth, getUserFiles);

//get recent activity of user files
router.get("/recent-activity", auth, getRecentActivity);

//get specific file data for chart creation
router.get("/:fileId", auth, getFileData);

export default router;
