import { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmation() {
    const [emailVerified, setEmailVerified] = useState(false);
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("_us_unr")) || null;
    const Token = localStorage.getItem("access_token") || null;
    const redirection = !user ? "/" : "/Auth/UserRoleSelection";

    // Helper to reload user and update localStorage/emailVerified state
    const reloadAndCheckUser = async () => {
        if (auth.currentUser) {
            try {
                await auth.currentUser.reload();
                const refreshedUser = auth.currentUser;
                if (refreshedUser) {
                    localStorage.setItem(
                        "_us_unr",
                        JSON.stringify({
                            ...user,
                            emailVerified: refreshedUser.emailVerified,
                        })
                    );
                    setEmailVerified(refreshedUser.emailVerified);
                    return refreshedUser.emailVerified;
                }
            } catch (error) {
                console.error("Error reloading user:", error);
            }
        }
        return false;
    };

    useEffect(() => {
        // Redirect if not authenticated
        if (!Token) {
            navigate("/auth/login");
            return;
        }

        let intervalId;

        const checkAndRedirect = async () => {
            setChecking(true);
            const verified = await reloadAndCheckUser();
            setChecking(false);
            if (verified) {
                navigate(redirection);
            }
        };

        // Initial check
        checkAndRedirect();

        // Poll every 5s
        intervalId = setInterval(checkAndRedirect, 5000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line
    }, [Token, user, navigate, redirection]);


    // Animated mail icon SVG
    const MailSentIcon = () => (
        <svg
            className="w-16 h-16 mx-auto mb-6 animate-bounce"
            viewBox="0 0 64 64"
            fill="none"
        >
            <rect width="64" height="64" rx="16" fill="#2563eb" />
            <g>
                <rect x="14" y="22" width="36" height="20" rx="4" fill="#fff" />
                <polyline
                    points="14,22 32,38 50,22"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <polyline
                    points="14,42 32,28 50,42"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <circle
                    cx="48"
                    cy="20"
                    r="4"
                    fill="#22c55e"
                    className="animate-pulse"
                />
                <path
                    d="M47 20.5l1.5 1.5 2-2"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );

    if (checking) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-blue-100">
                <div className="p-8 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="flex justify-center mb-4">
                        <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
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
                    </div>
                    <p className="text-lg font-medium text-gray-700">Checking email verification status...</p>
                </div>
            </div>
        );
    }

    if (!emailVerified) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
                <div className="p-8 bg-white rounded-2xl shadow-xl text-center max-w-md w-full">
                    <MailSentIcon />
                    <h2 className="text-2xl font-bold mb-2 text-blue-700">Verify Your Email</h2>
                    <p className="text-gray-600 mb-4">
                        We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
                    </p>
                    <div className="flex items-center justify-center mb-4">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-green-600 text-sm font-medium">Email sent</span>
                    </div>
                    <p className="text-gray-500 mb-6">
                        Once verified, you’ll be redirected automatically.
                    </p>
                    <button
                        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-semibold"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Status
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
