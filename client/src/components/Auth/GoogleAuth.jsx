import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import Google from '../../assets/google-logo.svg';

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
        className="w-full h-10 flex items-center justify-center border border-gray-200 bg-transparent  text-black font-semibold rounded-lg  hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <img src={Google} className='w-5 h-5 mr-2' />
        Sign in with Google
      </button>
    </div>
  );
};
