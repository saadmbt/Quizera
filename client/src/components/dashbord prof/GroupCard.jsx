import React, { useContext, useState } from 'react';
import { UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import toast from 'react-hot-toast';

const GroupCard = ({ name, count, groupId, onDelete }) => {
  const user = JSON.parse(localStorage.getItem("_us_unr")) || {};
  const [isLoading, setIsLoading] = useState(false);

  // Determine if user is professor
  const isProfessor = user.role === 'professor';

  const handleDelete = async () => {
    const confirmDelete = await new Promise((resolve) => {
      toast((t) => (
        <div className="bg-white p-4 rounded shadow-lg max-w-xs">
          <p className="mb-4">Are you sure you want to delete the group <strong>{name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
            >
              <TrashIcon className="h-5 w-5 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ));
    });

    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      if (onDelete) {
        await onDelete(groupId);
        toast.success('Group deleted successfully');
      } else {
        toast.error('Delete function not provided');
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error(error.message || 'Failed to delete group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative bg-white min-h-[150px] rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-blue-300"
    >
      <div className="flex  gap-4 flex-col md:flex-col md:items-start sm:flex-row sm:items-center  justify-between space-y-4 sm:space-y-0 sm:space-x-4 py-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 w-fit">
            <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{count} members</span>
          </div>
        </div>
        <div className="flex flex-row md:items-start gap-2 mt-4">
          <Link
            to={isProfessor ? `/professor/group/${groupId}/statistics?groupName=${encodeURIComponent(name)}` : `/Student/groups/${groupId}`}
            className={`inline-flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105
              ${isProfessor ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
          >
            View Details
          </Link>
          {isProfessor && (
            <>
              <Link
                to={`/professor/group/${groupId}/edit`}
                className="inline-flex items-center px-3 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow"
              >
                Edit Group
              </Link>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className={`inline-flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105
                  ${isLoading ? 'bg-red-100 text-red-400 cursor-not-allowed' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                title="Delete Group"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
