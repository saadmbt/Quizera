import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { applyActionCode } from "firebase/auth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const mode = query.get("mode");
    const oobCode = query.get("oobCode");

    if (mode === "verifyEmail" && oobCode) {
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus("success");
          setMessage("Your email has been successfully verified. Redirecting...");
          // Optionally reload user to update emailVerified status
          if (auth.currentUser) {
            auth.currentUser.reload();
          }
          setTimeout(() => {
            navigate("/auth/login");
          }, 3000);
        })
        .catch((error) => {
          setStatus("error");
          setMessage("The verification link is invalid or has expired.");
          console.error("Email verification error:", error);
        });
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [query, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100">
      <div className="p-8 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
        {status === "verifying" && (
          <>
            <p className="text-lg font-medium text-gray-700 mb-4">Verifying your email...</p>
            <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </>
        )}
        {status === "success" && (
          <p className="text-green-600 text-lg font-semibold">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-lg font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
