import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import excelAnimation from "../assets/excel.json"; // Update with your Lottie JSON file
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Redirect or call login API here
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-emerald-200 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
      >
        {/* Animation */}
        <div className="w-full md:w-1/2 p-6 bg-emerald-50 flex items-center justify-center">
          <Lottie
            animationData={excelAnimation}
            loop={true}
            className="max-h-96 w-full"
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-600 font-medium hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
