import { LogOut, Sidebar } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Header({ isInMain }) {
    const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}
    console.log("user",user)
    const {logout}=useContext(AuthContext)
    const navigate=useNavigate()
    const handleLogout = () => {
      logout();
      navigate("/");  
    };
    return (
        <header className="flex justify-between items-center sticky top-0 z-30 bg-white/80 mb-8 px-4 py-4 md:px-0">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-200 w-12 h-12 px-4 py-2 rounded-full font-semibold text-2xl flex items-center justify-center text-gray-600">
                            {user.username?.[0] || 'S'}
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Welcome back, {user.username}!</h2>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>
            </div>
            {isInMain &&(
            <div className="hidden md:flex items-center space-x-4">
                <button 
                onClick={handleLogout}
                 className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>)}
        </header>
    );
}
