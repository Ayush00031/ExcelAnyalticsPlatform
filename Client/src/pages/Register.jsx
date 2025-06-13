import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import excelAnimation from "../assets/excel.json"; // Replace with your Lottie file
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 6;

    if (!isLongEnough) return "Password must be at least 6 characters.";
    if (!hasUpperCase) return "Password must include an uppercase letter.";
    if (!hasNumber) return "Password must include a number.";
    return "";
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      !validatePassword(formData.password) &&
      formData.password === formData.confirmPassword
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const renderInput = (id, label, type = "text") => (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-800 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        required
        value={formData[id]}
        onChange={handleChange}
        className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
      />
    </div>
  );

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

        {/* Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderInput("name", "Full Name")}
            {renderInput("email", "Email", "email")}
            {renderInput("password", "Password", "password")}

            {passwordError && (
              <p className="text-sm text-red-500 -mt-2">{passwordError}</p>
            )}

            {renderInput("confirmPassword", "Confirm Password", "password")}

            {formData.password !== formData.confirmPassword &&
              formData.confirmPassword && (
                <p className="text-sm text-red-500 -mt-2">
                  Passwords do not match.
                </p>
              )}

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
              disabled={!isFormValid()}
              className={`w-full py-3 font-semibold rounded-lg transition ${
                isFormValid()
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
