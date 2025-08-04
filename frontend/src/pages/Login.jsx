import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { id, name, role } = res.data.user;

      localStorage.setItem("userId", id);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin");
      else if (role === "owner") navigate("/owner");
      else if (role === "user") navigate("/user");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Top Full-Screen Banner/Nav Section */}
      <div className="h-50 flex items-center justify-center bg-blue-400 text-white">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to StoreRatings</h1>
          <p className="text-lg">
            Sign in to rate stores and help others choose the best ones!
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center py-12 bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
