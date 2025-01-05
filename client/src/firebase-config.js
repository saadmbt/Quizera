import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBP9qrjCVD_oReUQUrcAn5li5MvIuhnq6U",
  authDomain: "client--v1.firebaseapp.com",
  projectId: "client--v1",
  storageBucket: "client--v1.firebasestorage.app",
  messagingSenderId: "263438758805",
  appId: "1:263438758805:web:f124fda577e281c045bc9c",
  measurementId: "G-50YYM1EZLY",
};// firebase-config.js


export const updateUserProfile = async (displayName, photoURL) => {
  const user = getAuth().currentUser;
  if (user) {
    await updateProfile(user, {
      displayName,
      photoURL,
    });
  } else {
    throw new Error("No user is logged in");
  }
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
