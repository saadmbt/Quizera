import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import { FaCog, FaSignOutAlt, FaHeadset } from "react-icons/fa"; // Import des icônes

const Dashboard = () => {
  const [userName, setUserName] = useState(""); // État pour stocker le nom de l'utilisateur
  const [showProfileMenu, setShowProfileMenu] = useState(false); // État pour afficher/cacher la carte
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "User"); // Utiliser le nom ou "User" par défaut
    } else {
      navigate("/login"); // Rediriger si l'utilisateur n'est pas connecté
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Rediriger vers la page de connexion après déconnexion
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSettingsClick = () => {
    navigate("/account-info"); // Rediriger vers la page AccountInfo lorsqu'on clique sur Settings
  };

  return (
    <div className="dashboard-container">
      {/* Barre de navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
        {/* Logo ou Titre */}
        <div className="text-xl font-semibold text-gray-700">Dashboard</div>

        {/* Profil et Menu */}
        <div className="relative">
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="text-gray-700">
              Welcome, <span className="font-bold">{userName}</span>
            </div>
            <img
              src={
                auth.currentUser?.photoURL || "https://via.placeholder.com" // Image par défaut si aucune photo n'est disponible
              }
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
              onClick={() => setShowProfileMenu(!showProfileMenu)} // Toggle le menu
            />
          </div>

          {/* Menu Profil */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-200 z-10">
              <ul>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSettingsClick} // Clique sur Settings pour aller sur AccountInfo
                >
                  <FaCog className="mr-3 text-gray-600" />
                  <span>Settings</span>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaHeadset className="mr-3 text-gray-600" />
                  <span>Contact Support</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-3 text-gray-600" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-gray-700 mt-4">This is your dashboard content.</p>
      </div>
    </div>
  );
};

export default Dashboard;
