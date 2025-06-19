import React from "react";
import { useSelector } from "react-redux";

const WelcomeBanner = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome back, {user?.username || "User"}!
      </h2>
      <p className="text-sm text-gray-600">Here is your analytics overview</p>
    </div>
  );
};

export default WelcomeBanner;
