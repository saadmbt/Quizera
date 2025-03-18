import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config"; // Make sure firebase-config is correctly configured
import { onAuthStateChanged } from "firebase/auth";

// Create a context
export const AuthContext = createContext();

// Create a context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // The connected user state

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
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};