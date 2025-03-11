import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ArrowUpTrayIcon, BookOpenIcon, AcademicCapIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: HomeIcon, text: 'Dashboard', path: '/' },
    { icon: UserGroupIcon, text: 'Groups', path: '/groups' },
    { icon: ArrowUpTrayIcon, text: 'Upload', path: '/upload' },
    { icon: BookOpenIcon, text: 'Lessons', path: '/lessons' },
    { icon: AcademicCapIcon, text: 'Quizzes', path: '/quizzes' },
    { icon: Cog6ToothIcon, text: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold">DASHBOARD</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={clsx(
              "flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600",
              location.pathname === item.path && "bg-blue-50 text-blue-600"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;