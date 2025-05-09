import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
      setMessage("");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/Auth/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-white bg-blue-600 rounded-lg 
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} 
              transform transition-all active:scale-95 flex justify-center items-center`}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending...
              </span>
            ) : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/Auth/login")}
            className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Back to Login
          </button>
        </form>

        {message && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
