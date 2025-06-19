import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/files/recent-activity"
        );
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to load recent activity:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No recent activity</p>
      ) : (
        <ul className="space-y-3 text-sm text-gray-700">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              {activity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
