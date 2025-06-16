import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Route imports
import auth from "./routes/auth.routes.js";
import fileRoutes from "./routes/files.js";
import chartRoutes from "./routes/chart.js";
import adminRoutes from "./routes/admin.js";

// Routes
app.use("/api/files", fileRoutes);
app.use("/api/auth", auth);
app.use("/api/charts", chartRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed", err.message));
