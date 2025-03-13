import { LayoutIcon } from 'lucide-react';
import React from 'react'
import UpgradePlanCard from './UpgradePlanCard';
import {navigationItems} from '../../constants/index'

function Sidebar({isSidebarOpen, toggleSidebar, setCurrentPage, currentPage}) {
  return (
    <>
        {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      {/* Sidebar */}
        <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col z-50
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <LayoutIcon className="h-6 w-6" />
            PrepGenius
          </h1>
        </div>
        
        <nav className="mt-6 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.id);
                toggleSidebar();
              }}
              className={`
                flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 
                hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200
                ${currentPage === item.id ? 'bg-blue-50 dark:bg-gray-700 border-r-4 border-blue-500' : ''}
              `}
            >
              {React.cloneElement(item.icon, { className: 'h-5 w-5 mr-3' })}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Upgrade Plan Card */}
        <UpgradePlanCard />
      </aside>
    </>
    
  )
}

export default Sidebar