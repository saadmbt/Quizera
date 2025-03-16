import { Sidebar } from "lucide-react";

export default function Header({ onToggleSidebar }) {
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
                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"
                    alt="User avatar"
                    className="w-12 h-12 rounded-full"
                />
                <div>
                    <h2 className="text-xl font-semibold">Welcome back, User!</h2>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>
            </div>
        </header>
    );
}
