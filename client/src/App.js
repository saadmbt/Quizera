import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginWithFirebase from "./compnents/login/login";
import Dashboard from "./compnents/dashboard";
import { AuthProvider } from "./compnents/login/AuthContext";
import Accueil from "./compnents/acceuil.jsx/accueil";
import Register from "./compnents/login/Register";
import ForgetPassword from "./compnents/login/forgetpassword";
import AccountInfo from "./compnents/AccountInfo";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route de la page de connexion */}
          
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginWithFirebase />} />
          <Route path="/logup" element={<Register />} />
          {/* Route vers le dashboard après connexion */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account-info" element={<AccountInfo />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
