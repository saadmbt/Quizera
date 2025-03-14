import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
const StudentDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
 
  
    return (
        <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onClose={() => setIsSidebarOpen(false)}/>
            <div className="p-4 md:p-8 lg:p-12 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentDashboardLayout;
