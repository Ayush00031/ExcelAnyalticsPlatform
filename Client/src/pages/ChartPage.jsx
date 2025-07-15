import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles, getFileDataById } from "../redux/slices/fileSlice";
import { Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ChartPage = () => {
  const dispatch = useDispatch();
  const { userFiles, selectedFileData, loading } = useSelector(
    (state) => state.files
  );
  const [selectedFileId, setSelectedFileId] = useState("");

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  useEffect(() => {
    if (selectedFileId) {
      dispatch(getFileDataById(selectedFileId));
    }
  }, [selectedFileId, dispatch]);

  const renderBarChart = () => {
    if (
      !selectedFileData?.data ||
      !Array.isArray(selectedFileData.data) ||
      selectedFileData.data.length === 0 ||
      !selectedFileData?.columns ||
      selectedFileData.columns.length < 2
    ) {
      return (
        <p className="text-center text-gray-500">
          Not enough data to generate a chart.
        </p>
      );
    }

    const labels = selectedFileData.data.map(
      (row) => row[selectedFileData.columns[0]]
    );
    const values = selectedFileData.data.map(
      (row) => row[selectedFileData.columns[1]]
    );

    const data = {
      labels,
      datasets: [
        {
          label: selectedFileData.columns[1],
          data: values,
          backgroundColor: "rgba(16, 185, 129, 0.6)",
        },
      ],
    };

    return <Bar data={data} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 mt-4 sm:ml-60">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Chart Generator
          </h1>

          <div className="max-w-xl mx-auto mb-8">
            <label className="block mb-2 text-gray-700 font-medium">
              Select an uploaded Excel file:
            </label>
            <select
              className="w-full border px-4 py-2 rounded-md"
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
            >
              <option value="">-- Choose File --</option>
              {userFiles.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalFileName}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <p className="text-center text-emerald-500">Loading file data...</p>
          )}

          <div className="bg-white p-6 rounded-xl shadow-md">
            {selectedFileId && renderBarChart()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChartPage;
