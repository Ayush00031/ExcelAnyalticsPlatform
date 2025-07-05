import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles } from "../redux/slices/fileSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex pt-6">
        <Sidebar />

        <main className="ml-64 w-full p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700">
            Upload History
          </h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && files.length === 0 && (
            <p className="text-gray-600">No uploaded files yet.</p>
          )}

          {!loading && files.length > 0 && (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500"
                >
                  <p className="text-lg font-semibold">
                    {file.originalFileName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Uploaded on: {format(new Date(file.uploadDate), "PPPp")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Size: {(file.fileSize / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    Columns: {file.columns?.join(", ") || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
