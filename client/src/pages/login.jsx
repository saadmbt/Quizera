import { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

// add firestor to signup  and store the JWT  to the context hook
// add a protected route  for student and professor each one has a different dashboard

export default function LoginWithFirebase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user){
        getJWT(user.uid);
        navigate("/dashboard")
      } ;
     
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        default:
          setErrorMessage(
            "Failed to log in. Please check your email and password."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100" loading="lazy">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        {errorMessage && (
          <div className="p-3 bg-red-100 text-red-600 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
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
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-11 text-gray-600 focus:outline-none"
            >
              {passwordVisible ? (
                <i className="fas fa-eye-slash"></i>
              ) : (
                <i className="fas fa-eye"></i>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <GoogleLogin onSuccess={(Credential)=>{ console.log(Credential)}} className="w-full h-10 flex items-center justify-center border border-gray-200 bg-transparent  text-black font-semibold rounded-lg  hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </form>
        <p className="text-sm text-center text-gray-600">
          Forgot your password?{" "}
          <span
            onClick={() => navigate("/forgetpassword")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Reset it here
          </span>
        </p>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/auth/Signup")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up now
          </span>
        </p>
      </div>
    </div>
  );
}
