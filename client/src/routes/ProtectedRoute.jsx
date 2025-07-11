import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({ allowedRoles, children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = localStorage.getItem("access_token") || null;
  const user = JSON.parse(localStorage.getItem("_us_unr")) || null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("User not found in localStorage");
      localStorage.clear();
      navigate("/auth/login");
      return;
    }

    let decodedToken = null;
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      console.error("Invalid token:", e);
      localStorage.clear();
      navigate("/auth/login");
      return;
    }

    if (!user || !user?.role) {
      navigate("/auth/UserRoleSelection");
      return;
    }

    // if (!user?.emailVerified) {
    //   navigate("/auth/verify-email");
    //   return;
    // }

    const userRole = user?.role.toLowerCase();
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

    if (!allowedRolesLower.includes(userRole)) {
      navigate("/");
      return;
    }

    setIsAuthorized(true);
  }, [token, user, allowedRoles, navigate]);

  if (!isAuthorized) {
    return null;
  }

  return children;
}
