import express from "express";
import auth from "../middlewares/auth.middlewares.js";
import {
  upload,
  uploadExcelFile,
  getUserFiles,
  getFileData,
} from "../controllers/fileController.js";

const router = express.Router();

//upload excel file
router.post("/upload", upload.single("excel"), uploadExcelFile);

// Get user's uploaded files
router.get("/", auth, getUserFiles);

//get specific file data for chart creation
router.get("/:fileId", auth, getFileData);

export default router;
