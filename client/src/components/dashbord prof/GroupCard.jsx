import React, { useContext } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const GroupCard = ({ name, count, groupId }) => {
  const  user = JSON.parse(localStorage.getItem("_us_unr")) || {};
  
  return (
    <div className="bg-white min-h-[150px] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between space-x-4 py-4 gap-3"> 
        <div>
          <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center mt-3 text-gray-600">
            <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{count} members</span>
          </div>
        </div>
        <div className="space-x-3">
          <Link
            to={`/${user.role}/groups/${groupId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            View
          </Link>
          {user.role === 'professor' && (
            <Link
            to={`/professor/group/${groupId}/edit`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Edit
          </Link>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
