import { GoogleLogin } from "@react-oauth/google";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { jwtDecode} from "jwt-decode";
import { doc ,getDoc ,setDoc} from "firebase/firestore";
import { AuthContext } from "./AuthContext";
const handleGoogleLogin = async (credentialResponse) => {
  const credential = jwtDecode(credentialResponse.credential);
  const uid = credential.sub;
  const {setUser} = useContext(AuthContext);
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
    navigate(`/${userData.role}-dashboard`);
  } else {
     // Add user data to Firestore
          await setDoc(doc(db, "users", uid), {
            email: credential.email,
            role: "nnn",
            createdAt: new Date().toISOString(),
          });
      // Add user data obj to context
      const userobj ={
        uid: uid,
      }
      setUser(userobj);
      // generate JWT token and save it to local storage
     getJWT(uid);
    console.log("User does not exist, redirecting to set username and role");
    navigate("/Auth/user-role");
  }
};

export const GoogleAuthButton = () => {
  const navigate = useNavigate(); // Initialize navigate here
  return (
    <div className="mt-4 ">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Error occurred")}
      />
    </div>
  );
};
