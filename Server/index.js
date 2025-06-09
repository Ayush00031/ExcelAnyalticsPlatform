import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import auth from "./routes/auth.routes.js"; // Make sure this exports the router directly

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use router directly, no `.route`
app.use("/api/auth", auth);
app.get("/", (req, res) => {
  res.send("Excel Analytics API is running...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI) // remove deprecated options here
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error(err));
