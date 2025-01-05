import React, { useEffect, useState } from "react";
import { auth, updateUserProfile } from "../firebase-config"; // Import de la fonction pour mettre à jour le profil
import { FaSave, FaEdit } from "react-icons/fa"; // Icônes pour édition et sauvegarde
import { Navigate } from "react-router-dom";
const AccountInfo = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState(""); 
  const [isEditing, setIsEditing] = useState(false); 
  
  useEffect(() => {
    // Vérification si l'utilisateur est connecté
    if (auth.currentUser.email) {
      setUserName(auth.currentUser.displayName || "No name");
      setUserEmail(auth.currentUser.email || "No email");
      setUserPhoto(
        auth.currentUser.photoURL || "https://via.placeholder.com/150"
      );
    } else {
      Navigate("/dashboard");
    }
  }, []);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSave = async () => {
    try {
      await updateUserProfile(userName, userPhoto); // Mise à jour du profil Firebase
      setIsEditing(false); // Désactiver le mode édition après la sauvegarde
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
      alert(`Erreur : ${error.message}`);
    }
  };

  // Fonction pour gérer les changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") {
      setUserName(value);
    } else if (name === "userPhoto") {
      setUserPhoto(value);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-700">Account Information</h1>
      <div className="mt-6">
        <div className="flex items-center mb-4">
          {/* Affichage de l'image de profil */}
          <img
            src={userPhoto}
            alt="User Profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          {isEditing && (
            <input
              type="text"
              name="userPhoto"
              value={userPhoto}
              onChange={handleChange}
              className="ml-4 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Change Profile Picture URL"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              className="mt-2 px-3 py-2 border border-gray-300 rounded-lg w-full"
            />
          ) : (
            <p className="mt-2 text-gray-600">{userName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <p className="mt-2 text-gray-600">{userEmail}</p>
        </div>

        <div className="flex justify-between items-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
            >
              <FaSave className="mr-2" /> Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
