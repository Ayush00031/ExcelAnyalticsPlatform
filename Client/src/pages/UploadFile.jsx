import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadExcelFile } from "../redux/slices/fileSlice"; // optional Redux action
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

const UploadFile = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.files); // optional

  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setLocalError("");
    } else {
      setFile(null);
      setLocalError("Please upload a valid .xls or .xlsx file.");
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      setLocalError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    dispatch(uploadExcelFile(formData)); // call API (optional)

    // Reset UI (optional)
    // setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Upload Excel File
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center w-full px-4 py-8 bg-white dark:bg-gray-700 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-400">
              <FiUploadCloud className="text-4xl mb-2" />
              <span className="text-sm font-medium">
                Click to upload or drag & drop
              </span>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Selected: <strong>{file.name}</strong>
                </p>
              )}
            </label>
          </div>

          {localError && <p className="text-sm text-red-500">{localError}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-500">
              File uploaded successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadFile;
