import React from 'react';

const StatCard = ({ title, value, color, percentage }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">

      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${getColorClasses(color)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatCard;
