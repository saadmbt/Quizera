import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { db } from "../../firebase-config";
const handleGoogleLogin = async (credentialResponse) => {
  const idToken = credentialResponse.credential;
  const response = await axios.post("/api/google-auth", { idToken });

  if (response.data.exists) {
    // User already exists, log them in
    console.log("User  already exists");
  } else {
    // User does not exist, create a new account
    console.log("User  does not exist, creating new account");
    const userData = response.data.userData;

    // Create a new user account in firestone
    const userRef = await firebase.firestore().collection("users").add(userData);
    const userDoc = await userRef.get();
    const user = userDoc.data();
    
  }
};

export const GoogleAuthButton = () => {
  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => console.log("Error occurred")}
    />
  );
};