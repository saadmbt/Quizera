import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
      setMessage("");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/Auth/login");
      }, 3000); // 3 secondes avant de rediriger
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forget Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        </form>
        {message && (
          <div className="p-3 mt-4 bg-green-100 text-green-600 rounded text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mt-4 bg-red-100 text-red-600 rounded text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
