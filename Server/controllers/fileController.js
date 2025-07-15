import multer from "multer";
import XLSX from "xlsx";
import path from "path";
import FileUpload from "../models/fileUpload.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".xlsx", ".xls"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx and .xls files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

//upload and parse the Excel file
const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res
        .status(400)
        .json({ message: "The uploaded Excel file is empty" });
    }

    const columns = Object.keys(jsonData[0]);

    const fileUpload = new FileUpload({
      userId: req.user._id,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      data: jsonData,
      columns,
      status: "completed",
    });

    await fileUpload.save();

    res.status(200).json({
      message: "File uploaded and parsed successfully",
      file: {
        id: fileUpload._id,
        originalFileName: fileUpload.originalFileName,
        columns,
        rowCount: jsonData.length,
        uploadDate: fileUpload.uploadDate,
      },
    });
  } catch (error) {
    console.error("Full Error Stack", error);
    return res.status(500).json({
      message: "Error processing file",
      error: error.message,
      stack: error.stack,
    });
  }
};

//Get User's uploaded files
const getUserFiles = async (req, res) => {
  try {
    const files = await FileUpload.find({ userId: req.user._id })
      .sort({ uploadDate: -1 })
      .select("originalFileName fileSize uploadDate status columns");

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res
      .status(500)
      .json({ message: "Error fetching files", error: error.message });
  }
};

//Get file data for chart creation
const getFileData = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await FileUpload.findOne({
      _id: fileId,
      userId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      id: file._id,
      originalFileName: file.originalFileName,
      columns: file.columns,
      data: file.data.slice(0, 100), // Return only the first 100 rows for performance
      totalRows: file.data.length,
    });
  } catch (error) {
    console.error("Error fetching file data:", error);
    res
      .status(500)
      .json({ message: "Error fetching file data", error: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recentFiles = await FileUpload.find({ userId: req.user._id })
      .sort({ uploadDate: -1 })
      .limit(5)
      .select("originalFileName uploadDate");

    const activity = recentFiles.map((file) => {
      const date = new Date(file.uploadDate).toLocaleString();
      return `📄 Uploaded "${file.originalFileName}" on ${date}`;
    });

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res
      .status(500)
      .json({ message: "Failed to load activity", error: error.message });
  }
};

export {
  upload,
  uploadExcelFile,
  getUserFiles,
  getFileData,
  getRecentActivity,
};
