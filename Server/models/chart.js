import { Schema } from "mongoose";
const chartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filedId: {
    type: Schema.Types.ObjectId,
    ref: "FileUpload",
    required: true,
  },
  chartName: {
    type: String,
    required: true,
  },
  chartType: {
    type: String,
    enum: ["bar", "line", "pie", "scatter", "column3d"],
    required: true,
  },
  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
    required: true,
  },
  chartData: {
    type: Schema.Types.Mixed, // Can store any type of data
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
const Chart = mongoose.model("Chart", chartSchema);

export default Chart;
