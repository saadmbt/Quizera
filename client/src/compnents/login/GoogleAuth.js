import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      //console.log("Google User:", result.user);
      navigate("/dashboard"); // Redirect to dashboard after Google login
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-11 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-purple-400"
      >
        <FaGoogle className="mr-2 text-lg" />
        Login with Google
      </button>
    </div>
  );
};
