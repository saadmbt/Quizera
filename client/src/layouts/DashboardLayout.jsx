import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashbord prof/SideBar';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

export default DashboardLayout;
