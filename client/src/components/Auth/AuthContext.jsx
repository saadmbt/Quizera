import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config"; 
import { onAuthStateChanged } from "firebase/auth";
import { isTokenExpired } from "../../services/authService";
import { jwtDecode } from "jwt-decode";
import { SessionExpiredDialog } from "../PopUpsUI/SessionExpiredPopup";

// Create a context
export const AuthContext = createContext();

// Create a context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isexpired, setisexpired] = useState(false); 

  const isAuthenticated = !!user; // Determine if the user is authenticated

  useEffect(() => {
    // Check token expiration on first load
    const token = localStorage.getItem("access_token");
     let decodedToken = null;
        if(token){
            try{
                decodedToken = jwtDecode(token)
                console.log("decodedToken :",decodedToken)
            }catch (e){
                console.log(e)
            }
        }
    if (decodedToken && isTokenExpired(decodedToken)) {
      setisexpired(true)
      console.log("the token has been expired");
      setUser(null);
    }
    else{
      console.log("the token is still valid");
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

   if(isexpired){
    return <SessionExpiredDialog isOpen={true} onClose={() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("_us_unr");
      setisexpired(false);
    }} />
   }
  // Function to log out the user
  const logout = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("_us_unr");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated ,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
