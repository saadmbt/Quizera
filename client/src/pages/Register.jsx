import { useState , useContext} from "react";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../components/Auth/GoogleAuth";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../components/Auth/AuthContext";
import getJWT from "../services/authService";

export default function Register() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isloading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);
    // Gérer les erreurs
    const handleError = (error) => {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage(
            "This email is already registered. Please verify or log in."
          );
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email address.");
          break;
        default:
          setErrorMessage("Registration failed. Please try again.");
      }
    };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setisLoading(true);

    if (registerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setisLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const user = userCredential.user;
      console.log("Successfully registered:", user);
      // Add user data obj to context
      const userobj ={
        uid: user.uid,
      }
      setUser(userobj);
      // Add user data obj to Firestore
      await setDoc(doc(db, "users", user.uid),{
        email: user.email,
        role: "student",
        username: user.email.split("@")[0],
        createdAt: new Date().toISOString(),
      } );
      console.log("Successfully added user to Firestore:");
      // generate JWT token and save it to local storage
        getJWT(user.uid);
       // Redirect to set username and role page after registration is successful 
         navigate("/Auth/UserRoleSelection");
    } catch (error) {
      handleError(error);
    } finally {
      setisLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>

         {/* Affichage des erreurs ou du statut */}
        {errorMessage && (
          <div className="p-3 bg-red-100 text-red-600 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleRegister}>
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
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isloading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isloading ? "Registering..." : "Register"}
          </button>
          <GoogleAuthButton />
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/auth/Login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login now
          </span>
        </p>
      </div>
    </div>
  );
}
