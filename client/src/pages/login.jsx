import { useState, useContext } from "react";
import { auth, db } from "../firebase-config";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../components/Auth/GoogleAuth";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../components/Auth/AuthContext";
import getJWT from "../services/authService";


export default function LoginWithFirebase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext) || {};

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
      // console.log("Successfully logged in:", user);
      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userExists = await getDoc(userRef);

      if (userExists.exists()) {
        localStorage.setItem("isNew", false);
        const userData = userExists.data();
        // console.log("User data:", userData);
        const userobj = { uid: user.uid, username: userData.username, role: userData.role,emailVerified: user.emailVerified };
        setUser(userobj);
        // console.log("User object:", userobj);
        // generate JWT token and save it to local storage
        const token = await getJWT(user.uid);
        localStorage.setItem("access_token", token);
        localStorage.setItem("_us_unr", JSON.stringify(userobj));
        
        if (!user.emailVerified) {
        await sendEmailVerification(user);
        setErrorMessage("Please verify your email before logging in.");
        setLoading(false);
        navigate("/auth/verify-email");
        return;
      }
        // Check if there is a redirect path stored in localStorage
        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect) {
          // Remove redirect path from localStorage and navigate to it
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirect);
        } else {
          // Default navigation to user role page
          navigate(`/${userData.role}`);
        }
      } else {
        setErrorMessage("No user found with this email.");
      }
    } catch (error) {
      console.error(`Login failed: [${error.code}] ${error.message}`);
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
          setErrorMessage("Failed to log in. Please check your email and password.");
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="flex items-center mt-2 bg-gray-200 rounded-lg">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={togglePasswordVisibility} className="px-3 text-gray-600 focus:outline-none">
                {passwordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <GoogleAuthButton />
        </form>
        <p className="text-sm text-center text-gray-600">
          Forgot your password?{" "}
          <span onClick={() => navigate("/auth/forgetpassword")} className="text-blue-500 hover:underline cursor-pointer">
            Reset it here
          </span>
        </p>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <span onClick={() => navigate("/auth/Signup")} className="text-blue-500 hover:underline cursor-pointer">
            Sign up now
          </span>
        </p>
      </div>
    </div>
  );
}
