import { GoogleLogin } from "@react-oauth/google";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { doc ,getDoc ,setDoc} from "firebase/firestore";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export const GoogleAuthButton = () => {
  const navigate = useNavigate();
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
    // Check if user exists by ID in Firestore
      const userRef = doc(db, "users", uid);
      const userExists = await getDoc(userRef);
      console.log("User exists:", userExists.exists());
    if (userExists.exists()) {
      // User already exists, log them in
       console.log("User already exists", userExists.data());
      // Redirect to corresponding dashboard based on role
      const userData = userExists.data();
      setUser(userData)
      console.log("User data:", userData)
      // generate JWT token and save it to local storage
      getJWT(uid);
      navigate(`/${userData.role}`);
    } else {
       // Add user data to Firestore
            await setDoc(doc(db, "users", uid), {
              email: credential.email,
              role: "user", // Default role set to 'user'
              createdAt: new Date().toISOString(),
            }, { merge: true });
        // Add user data obj to context
        const userobj ={
          uid: uid,
        }
        setUser(userobj);
        // generate JWT token and save it to local storage
       getJWT(uid)

      console.log(`User with UID ${uid} does not exist, redirecting to set username and role`);
      navigate("/Auth/UserRoleSelection");
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
