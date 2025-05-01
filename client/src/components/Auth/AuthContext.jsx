import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config"; 
import { onAuthStateChanged } from "firebase/auth";
import { isTokenExpired } from "../../services/authService";

// Create a context
export const AuthContext = createContext();

// Create a context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const isAuthenticated = !!user; // Determine if the user is authenticated

  useEffect(() => {
    // Check token expiration on first load
    const token = localStorage.getItem("access_token");
    if (token && isTokenExpired(token)) {
      
      localStorage.removeItem("access_token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // When user logs in, update the user state with the current user
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          // Add any other user properties you need
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        // When user logs out, set user to null
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
