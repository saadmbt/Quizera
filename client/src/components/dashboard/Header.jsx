import { Sidebar } from "lucide-react";
import React, { useContext } from "react";
export default function Header({ onToggleSidebar }) {
    const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}
    console.log("user",user)
    return (
        <header className="flex justify-between items-center sticky top-0 z-30 bg-white/80 mb-8 px-4 py-4 md:px-0">
            <div className="flex items-center space-x-4">
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => {
                        console.log("Toggle button clicked.");
                        onToggleSidebar();
                    }}
                >
                    <Sidebar className="h-6 w-6" />
                </button>
                <div className="bg-gray-200 w-12 h-12 px-4 py-2 rounded-full font-semibold text-2xl flex items-center justify-center text-gray-600">
                            {user.username?.[0] || 'S'}
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Welcome back, {user.username}!</h2>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>
            </div>
        </header>
    );
}
