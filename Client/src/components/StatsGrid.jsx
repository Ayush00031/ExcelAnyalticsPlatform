import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsGrid = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/files/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statLabels = [
    { label: "Files Uploaded", key: "filesUploaded" },
    { label: "Charts Created", key: "chartsCreated" },
    { label: "Total Downloads", key: "totalDownloads" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statLabels.map((item) => (
        <div
          key={item.label}
          className="bg-white p-4 rounded-lg shadow text-center"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-xl font-bold text-emerald-600">
            {loading ? "..." : stats?.[item.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
