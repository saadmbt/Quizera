import { Moon, Sidebar, Sun } from "lucide-react";

export default function Header({ darkMode, onToggleDarkMode, onToggleSidebar }) {
    return (
        <header className="flex justify-between items-center mb-8 px-4 md:px-0">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={onToggleSidebar}
          >
            <Sidebar className="h-6 w-6" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Welcome back, User!</h2>
            <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
        </button>
      </header>
    );
  }