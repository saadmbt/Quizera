import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config";// Assurez-vous que firebase-config est correctement configuré
import { onAuthStateChanged } from "firebase/auth";

// Crée un contexte
export const AuthContext = createContext();

// Crée un fournisseur de contexte
export const AuthProvider = ({ children }) => {
  const [userdetails, setUserdetails] = useState(null); // L'état de l'utilisateur connecté  
  const [user, setUser] = useState(null); // L'état de l'utilisateur connecté  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserdetails(user); // Mettre à jour l'état lorsque l'utilisateur se connecte

      } else {
        setUserdetails(null); // Mettre à jour l'état lorsque l'utilisateur se déconnecte
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user ,setUser }}>
      {children} 
    </AuthContext.Provider>
  );
};
