import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const GroupCard = ({ name, count, groupId }) => {
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
          <Link
            to={`/professor/group/${groupId}`}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            View
          </Link>
          <Link
            to={`/professor/group/${groupId}/edit`}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
