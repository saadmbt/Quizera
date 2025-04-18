import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { Toaster } from 'react-hot-toast';

const StudentDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        console.log("Toggling sidebar. Current state:", isSidebarOpen);
        setIsSidebarOpen((prev) => !prev);
    };


    return (
        <div className='min-h-screen flex bg-gray-50'>
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="p-4 md:p-8 lg:p-12 w-full">
            <div>
                
            </div>
                {/* Main Content */}
                <Outlet context={{ toggleSidebar }} />
            </div>
             {/* Toaster for Notifications */}
            <Toaster position="top-right" />
        </div>
    );
};

export default StudentDashboardLayout;
