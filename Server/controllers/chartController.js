import Chart from "../models/Chart.js";
import FileUpload from "../models/fileUpload.js";

export const createChart = async (req, res) => {
  try {
    const { fileId, chartName, chartType, xAxis, yAxis } = req.body;

    //Validate input
    if (!fileId || !chartName || !chartType || !xAxis || !yAxis) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Get file data
    const file = await FileUpload.findOne({ _id: fileId, userId: req.user.id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    //validate axis exist in data
    if (!file.columns.includes(xAxis) || !file.columns.includes(yAxis)) {
      return res.status(400).json({ message: "Invalid axis selected" });
    }

    //process data for chart
    const chartData = processChartData(file.data, xAxis, yAxis, chartType);

    //save chart
    const chart = new Chart({
      userId: req.user.id,
      fileId,
      chartName,
      chartType,
      xAxis,
      yAxis,
      chartData,
    });

    await chart.save();
    res.status(201).json({
      message: "Chart created successfully",
      chart: {
        id: chart._id,
        chartName: chart.chartName,
        chartType: chart.chartType,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        chartData: chart.chartData,
        createdDate: chart.createdDate,
      },
    });
  } catch (err) {
    console.error("chart creation error:", err);
    res
      .status(500)
      .json({ message: "Error creating chart", error: err.message });
  }
};

//Get user's charts
export const getUserCharts = async (req, res) => {
  try {
    const charts = await Chart.find({ userId: req.user.id })
      .populate("fileId", "originalFileName")
      .sort({ createdDate: -1 });
    res.json(charts);
  } catch (err) {
    console.error("Error fetching charts:", err);
    res
      .status(500)
      .json({ message: "Error fetching charts", error: err.message });
  }
};

//Get a specific chart
export const getChart = async (req, res) => {
  try {
    const { chartId } = req.params;

    const chart = await Chart.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("fileId", "originalFileName");

    if (!chart) {
      return res.status(404).json({ message: "Chart not found" });
    }

    res.json(chart);
  } catch (err) {
    console.error("Error fetching chart:", err);
    res
      .status(500)
      .json({ message: "Error fetching chart", error: err.message });
  }
};

//Helper function to process chart data
const processChartData = (data, xAxis, yAxis, chartType) => {
  const labels = [];
  const values = [];

  if (chartType === "pie") {
    const aggregated = {};
    data.forEach((row) => {
      const xValue = row[xAxis];
      const yValue = parseFloat(row[yAxis]) || 0;
      aggregated[xValue] = (aggregated[xValue] || 0) + yValue;
    });

    Object.entries(aggregated).forEach(([key, value]) => {
      labels.push(key);
      values.push(value);
    });
  } else {
    data.forEach((row) => {
      labels.push(row[xAxis]);
      values.push(parseFloat(row[yAxis]) || 0);
    });
  }
  return {
    labels: labels.slice(0, 50), // Limit to 50 labels for better readability
    datasets: [
      {
        label: yAxis,
        data: values.slice(0, 50), // Limit to 50 data points for better readability
        backgroundColor: generateColors(Math.min(labels.length, 50)),
        borderColor: "#5b6e74",
        borderWidth: 2,
      },
    ],
  };
};

// Helper: Generate colors
const generateColors = (count) => {
  const colors = [
    "#5b6e74",
    "#819fa7",
    "#bde8f1",
    "#f2f2f0",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
