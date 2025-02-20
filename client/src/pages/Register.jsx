import { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../components/Auth/GoogleAuth";
import logo from '../assets/logo3.png';

export default function Register() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(""); // État pour le statut de vérification
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (registerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Créer un utilisateur temporaire
      const tempUserCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const tempUser = tempUserCredential.user;

      // Envoyer un email de vérification
      await sendEmailVerification(tempUser);
      setVerificationStatus("waiting"); // Mettre le statut à "waiting" après l'envoi de l'email

      // Débuter un intervalle pour vérifier l'état de vérification
      const startTime = Date.now();
      const interval = setInterval(async () => {
        await tempUser.reload();

        // Si l'email est vérifié
        if (tempUser.emailVerified) {
          clearInterval(interval); // Arrêter l'intervalle
          setVerificationStatus("success"); // Mettre à jour le statut à "success"
          setErrorMessage("Email verified. Registration successful.");
          navigate("/login"); // Rediriger l'utilisateur
        }

        // Si plus de 60 secondes se sont écoulées
        if (Date.now() - startTime > 60000) {
          clearInterval(interval); // Arrêter l'intervalle
          await deleteUser(tempUser); // Supprimer l'utilisateur
          setVerificationStatus("timeout"); // Mettre à jour le statut à "timeout"
          setErrorMessage("Verification timed out. Please try again.");
        }
      }, 1000); // Vérifier toutes les secondes
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <a href='/' className='cursor-pointer flex items-center justify-center'>
          <img src={logo} alt='logo' className='w-64 h-13' />
        </a>
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

        {/* Affichage du message de statut selon l'état */}
        {verificationStatus === "waiting" && (
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded text-center">
            A verification email has been sent. Please verify your email.
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="p-3 bg-green-100 text-green-600 rounded text-center">
            Your email has been verified successfully.
          </div>
        )}

        {verificationStatus === "timeout" && (
          <div className="p-3 bg-red-100 text-red-600 rounded text-center">
            Verification timed out. Please try again.
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
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <GoogleAuth />
        </form>
      </div>
    </div>
  );
}
