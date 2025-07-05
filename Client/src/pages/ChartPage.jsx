import React, { useRef, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

ChartJS.register(...registerables);

const ChartPage = () => {
  const chartRef = useRef();
  const [chartType, setChartType] = useState("bar");

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const downloadAsImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadAsPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("chart.pdf");
  };

  const renderChart = () => {
    const props = { data: chartData };
    if (chartType === "bar") return <Bar {...props} />;
    if (chartType === "line") return <Line {...props} />;
    if (chartType === "pie") return <Pie {...props} />;
    return null;
  };

  const render3DChart = () => (
    <Canvas style={{ height: 300 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex pt-6">
        <Sidebar />

        <main className="ml-64 w-full p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700">
            Chart Dashboard
          </h2>

          <div className="mb-4">
            <select
              className="p-2 border rounded-md"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>

          <div
            ref={chartRef}
            className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-4xl"
          >
            {renderChart()}
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={downloadAsImage}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
            >
              Download PNG
            </button>
            <button
              onClick={downloadAsPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Download PDF
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
            <h3 className="text-lg font-semibold mb-2">3D Chart</h3>
            {render3DChart()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartPage;
