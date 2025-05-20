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
      className="relative bg-white min-h-[150px] rounded-lg p-6 shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center justify-between space-x-4 py-4 gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {name}
          </h3>
          <div className="flex items-center mt-3 text-gray-600">
            <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{count} members</span>
          </div>
        </div>
        <div className="space-x-3 flex items-center">
          <Link
            to={isProfessor ? `/professor/group/${groupId}/statistics?groupName=${encodeURIComponent(name)}` : `/Student/groups/${groupId}`}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${isProfessor ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-600 bg-blue-100 hover:bg-blue-200'}`}
          >
            View
          </Link>
          {isProfessor && (
            <>
              <Link
                to={`/professor/group/${groupId}/edit`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors duration-200"
                title="Delete Group"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
