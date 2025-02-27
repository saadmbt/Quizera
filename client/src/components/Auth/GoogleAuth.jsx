import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase-config';
import Google from '../../assets/google-logo.svg';

export const GoogleAuth = () => {
  const navigate = useNavigate();

  // Function to handle Google login using Firebase authentication
  // It signs in the user with a Google popup and navigates based on user status
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = result.additionalUserInfo.isNewUser;
        console.log(isNewUser);
        console.log(result.additionalUserInfo);
        if (isNewUser) {
          navigate("/choistype"); // Redirect to choistype if the user is new
        } else {
          navigate("/dashboard"); // Redirect to dashboard if the user already has an account
        }
      } catch (error) {
        if (error.code === 'auth/popup-blocked') {
          console.error("Popup blocked by the browser. Please allow popups and try again.");
        } else {
          console.error("Google Login Error:", error.message);
        }
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-10 flex items-center justify-center border border-gray-200 bg-transparent  text-black font-semibold rounded-lg  hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <img src={Google} alt="Google logo" className='w-5 h-5 mr-2' />
        Sign in with Google
      </button>
    </div>
  );
};