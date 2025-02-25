import React ,{ useEffect } from 'react';
import Google from '../../assets/google-logo.svg';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../../firebase-config';

export const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const isNewUser = result.additionalUserInfo.isNewUser;
          console.log("isNewUser:", isNewUser);
          if (isNewUser) {
            navigate("/choistype"); // Redirect to choistype if the user is new
          } else {
            navigate("/dashboard"); // Redirect to  dashboard if the user already has an account
          }
        }
      } catch (error) {
        console.error("Google Login Error:", error.message);
      }
    };

    checkRedirectResult();
  }, [navigate]);

  return (
  <div className="flex flex-col gap-4 mt-6">
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="
        w-full h-10 flex items-center justify-center border border-gray-200 bg-transparent rounded-md
        ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400
      "
    >
      <img src={Google} alt="Google logo" className='w-5 h-5 mr-2' />
      Sign in with Google
    </button>
  </div>
);
};