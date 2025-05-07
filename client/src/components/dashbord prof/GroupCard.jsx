import React, { useContext, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import GroupStatistics from '../../pages/Dashboard/GroupStatistics';

const GroupCard = ({ name, count, groupId }) => {
  const user = JSON.parse(localStorage.getItem("_us_unr")) || {};
  const [isHovered, setIsHovered] = useState(false);

  // Determine if user is professor
  const isProfessor = user.role === 'professor';

  return (
    <div
      className={`relative bg-white min-h-[150px] rounded-lg p-6 shadow-lg transition-all duration-300 border border-gray-100
        ${isProfessor ? 'hover:shadow-xl hover:border-blue-200 transform hover:-translate-y-1' : ''}`}
      onMouseEnter={() => isProfessor && setIsHovered(true)}
      onMouseLeave={() => isProfessor && setIsHovered(false)}
    >
      <div className="flex items-center justify-between space-x-4 py-4 gap-3">
        <div>
          <h3 className={`text-lg font-bold text-gray-800 ${isProfessor ? 'hover:text-blue-600 transition-colors' : ''}`}>
            {name}
          </h3>
          <div className="flex items-center mt-3 text-gray-600">
            <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{count} members</span>
          </div>
        </div>
        <div className="space-x-3">
          {console.log('GroupCard link:', isProfessor ? `/professor/group/${groupId}/statistics?groupName=${encodeURIComponent(name)}` : `/student/group/${groupId}`)}
          <Link
            to={isProfessor ? `/professor/group/${groupId}/statistics?groupName=${encodeURIComponent(name)}` : `/student/group/${groupId}`}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${isProfessor ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-600 bg-blue-100 hover:bg-blue-200'}`}
          >
            View
          </Link>
          {isProfessor && (
            <Link
              to={`/professor/group/${groupId}/edit`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
      {isProfessor && isHovered && (
        <div className="absolute top-full left-0 z-10 mt-2 w-[400px] max-w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-auto max-h-[300px]">
          <GroupStatistics groupid={groupId} groupName={name} />
        </div>
      )}
    </div>
  );
};

export default GroupCard;
