import { GoogleLogin } from "@react-oauth/google";
import { db } from "../../firebase-config";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import getJWT from "../../services/authService";

export const GoogleAuthButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {setUser} = useContext(AuthContext);

  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      console.error("Invalid credential response");
      return;
    }

    let credential;
    try {
      credential = jwtDecode(credentialResponse.credential);
    } catch (error) {
      console.error("Failed to decode credential:", error);
      return;
    }

    const uid = credential.sub;
    const userRef = doc(db, "users", uid);
    const userExists = await getDoc(userRef);
    console.log("User exists:", userExists.exists());

    if (userExists.exists()) {
      const userData = userExists.data();
      setUser(userData);
      console.log("User data:", userData);
      getJWT(uid);
      
      // After setting the user, check for redirect path
      const redirect = localStorage.getItem('redirectAfterLogin');
      if (redirect) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirect);
      } else {
        navigate(`/${userData.role}`);
      }
    } else {
      await setDoc(doc(db, "users", uid), {
        email: credential.email,
        role: "Student",
        createdAt: new Date().toISOString(),
      }, { merge: true });

      const userobj = {
        uid: uid,
      };
      setUser(userobj);
      getJWT(uid);

      // After setting up new user, check for redirect
      const from = location.state?.from || "/Auth/UserRoleSelection";
      navigate(from);
    }
  };
  
  return (
    <div className="mt-4">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.error("Error occurred during Google login");
          alert("An error occurred while trying to log in. Please try again.");
        }}
      />
    </div>
  );
};
