import React from 'react';

const ProgressOverviewCard = ({ title, value, color, Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transform hover:scale-105 transition-transform duration-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${color} bg-opacity-20 p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold mt-2 dark:text-white">{value}</p>
      <div className={`h-2 rounded-full mt-4 ${color} bg-opacity-20`}>
        <div className={`h-full rounded-full ${color}`} style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default ProgressOverviewCard;