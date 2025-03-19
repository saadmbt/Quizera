import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const GroupCard = ({ name, count }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center mt-2 text-gray-600">
            <UserGroupIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{count}</span>
          </div>
        </div>
        <div className="space-x-2">
          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
            Study
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
