import User from "../models/user.models.js";
import FileUpload from "../models/fileUpload.js";
import Chart from "../models/Chart.js";

//Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

//get comprehensive chart statistics
export const getChartStats = async (req, res) => {
  try {
    const totalCharts = await Chart.countDocuments();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCharts = await Chart.countDocuments({
      createdDate: { $gte: thirtyDaysAgo },
    });
    const chartsByType = await Chart.aggregate([
      {
        $group: {
          _id: "$chartType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by count descending
    ]);

    const topUsers = await Chart.aggregate([
      { $group: { _id: "$userId", chartCount: { $sum: 1 } } },
      { $sort: { chartCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          chartCount: 1,
          userName: "$userInfo.name",
          userEmail: "$userInfo.email",
        },
      },
    ]);

    const chartTrends = await Chart.aggregate([
      {
        $match: {
          createdDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { totalCharts, recentCharts, chartsByType, topUsers, chartTrends },
    });
  } catch (error) {
    console.error("Error in getChartStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chart statistics",
      error: error.message,
    });
  }
};

//get all charts with pagination and filtering
export const getAllCharts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      chartType,
      userId,
      sortBy = "createdDate",
      sortOrder = "desc",
      search,
    } = req.query;

    const filter = {};
    if (chartType && chartType !== "all") filter.chartType = chartType;
    if (userId) filter.userId = userId;
    if (search) {
      filter.$or = [
        { chartName: { $regex: search, $options: "i" } },
        { xAxis: { $regex: search, $options: "i" } },
        { yAxis: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const charts = await Chart.find(filter)
      .populate("userId", "name email")
      .populate("fileId", "originalName uploadDate fileType fileSize")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalCharts = await Chart.countDocuments(filter);
    const totalPages = Math.ceil(totalCharts / limit);

    res.status(200).json({
      success: true,
      data: {
        charts,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalCharts,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching charts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch charts",
      error: error.message,
    });
  }
};

//get chart by ID with user and file details
export const getChartById = async (req, res) => {
  try {
    const { chartId } = req.params;
    const chart = await Chart.findById(chartId)
      .populate("userId", "name email createdAt")
      .populate("fileId", "originalName uploadDate fileType fileSize filePath")
      .lean();

    if (!chart) {
      return res
        .status(404)
        .json({ success: false, message: "Chart not found" });
    }

    res.status(200).json({ success: true, data: chart });
  } catch (error) {
    console.error("Error fetching chart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chart details",
      error: error.message,
    });
  }
};

// Delete chart by ID
export const deleteChart = async (req, res) => {
  try {
    const { chartId } = req.params;
    const chart = await Chart.findById(chartId);
    if (!chart)
      return res
        .status(404)
        .json({ success: false, message: "Chart not found" });

    await Chart.findByIdAndDelete(chartId);
    res.status(200).json({
      success: true,
      message: "Chart deleted successfully",
      data: { deletedChartId: chartId },
    });
  } catch (error) {
    console.error("Error deleting chart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chart",
      error: error.message,
    });
  }
};

// Bulk delete charts
export const bulkDeleteCharts = async (req, res) => {
  try {
    const { chartIds } = req.body;

    if (!Array.isArray(chartIds) || chartIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid chart IDs array",
      });
    }

    const result = await Chart.deleteMany({ _id: { $in: chartIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} charts`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Error bulk deleting charts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete charts",
      error: error.message,
    });
  }
};

// Get dashboard overview
export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalCharts,
      totalUsers,
      chartsToday,
      chartsThisWeek,
      chartsThisMonth,
      recentActivity,
    ] = await Promise.all([
      Chart.countDocuments(),
      User.countDocuments(),
      Chart.countDocuments({ createdDate: { $gte: startOfDay } }),
      Chart.countDocuments({ createdDate: { $gte: startOfWeek } }),
      Chart.countDocuments({ createdDate: { $gte: startOfMonth } }),
      Chart.find()
        .populate("userId", "name email")
        .populate("fileId", "originalName")
        .sort({ createdDate: -1 })
        .limit(10)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCharts,
        totalUsers,
        chartsToday,
        chartsThisWeek,
        chartsThisMonth,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalFiles = await FileUpload.countDocuments();
    const totalCharts = await Chart.countDocuments();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const activeSessions = await User.countDocuments({
      lastLogin: { $gte: yesterday },
    });

    res.json({ totalUsers, totalFiles, totalCharts, activeSessions });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const deletedCharts = await Chart.deleteMany({ userId });
    const deletedFiles = await FileUpload.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
      deletedCharts: deletedCharts.deletedCount,
      deletedFiles: deletedFiles.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await FileUpload.find()
      .populate("userId", "name email")
      .sort({ uploadDate: -1 });

    const formattedFiles = files.map((file) => ({
      _id: file._id,
      fileName: file.originalFileName,
      fileSize: file.fileSize,
      uploadDate: file.uploadDate,
      status: file.status,
      columns: file.columns,
      user: file.userId,
      dataRowCount: file.data?.length || 0,
    }));

    res.json(formattedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId)
      return res.status(400).json({ message: "File ID is required" });

    const file = await FileUpload.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const deletedCharts = await Chart.deleteMany({ fileId });
    await FileUpload.findByIdAndDelete(fileId);

    res.json({
      message: "File deleted successfully",
      fileName: file.originalFileName,
      deletedCharts: deletedCharts.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get storage usage
export const getStorageUsage = async (req, res) => {
  try {
    const files = await FileUpload.find();
    const totalSize = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    res.json({
      totalSizeMB: parseFloat(totalSizeMB),
      totalSizeBytes: totalSize,
      fileCount: files.length,
      formattedSize: formatBytes(totalSize),
    });
  } catch (error) {
    console.error("Error getting storage usage:", error);
    res.status(500).json({ message: "Server error" });
  }
};
