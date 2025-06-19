import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import excelAnimation from "../assets/excel.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../redux/slices/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password))
      return "Password must include an uppercase letter.";
    if (!/\d/.test(password)) return "Password must include a number.";
    return "";
  };

  const isFormValid = () =>
    formData.username &&
    formData.email &&
    !validatePassword(formData.password) &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }

    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordValidationMessage = validatePassword(formData.password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      return;
    }

    if (formData.password !== formData.confirmPassword) return;

    dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-2xl overflow-hidden border"
      >
        <div className="w-full md:w-1/2 p-6 bg-emerald-50 flex justify-center">
          <Lottie
            animationData={excelAnimation}
            loop
            className="max-h-96 w-full"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["username", "email", "password", "confirmPassword"].map(
              (field) => (
                <div key={field} className="w-full">
                  <label
                    htmlFor={field}
                    className="block text-sm mb-1 capitalize"
                  >
                    {field}
                  </label>
                  <input
                    type={
                      field.includes("password")
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )
            )}

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match.</p>
            )}

            <div>
              <label htmlFor="role" className="block text-sm mb-1">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading || !isFormValid()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-600 hover:underline"
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
