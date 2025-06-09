import mongoose from "mongoose";

const fileUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  data: [
    {
      type: mongoose.Schema.Types.Mixed, // Can store any type of data
    },
  ],
  columns: [String],
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["processing", "completed", "failed"],
    default: "processing",
  },
});

const FileUpload = mongoose.model("FileUpload", fileUploadSchema);
export default FileUpload;
