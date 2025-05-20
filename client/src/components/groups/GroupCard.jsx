import React, { useState } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { copyInviteLink } from '../../services/ProfServices';

const GroupCard = ({ group, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = localStorage.getItem("access_token");

  const handleCopyLink = async () => {
    try {
      if (!group._id) {
        throw new Error('Group ID is missing');
      }
      setIsLoading(true);
      await copyInviteLink(user, group._id);
      toast.success('Invitation link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy invitation link:', error);
      toast.error(error.message || 'Failed to copy invitation link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await new Promise((resolve) => {
      toast((t) => (
        <div className="bg-white p-4 rounded shadow-lg max-w-xs">
          <p className="mb-4">Are you sure you want to delete the group <strong>{group.group_name}</strong>? This action cannot be undone.</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
              </svg>
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
        await onDelete(group._id);
        // Removed toast.success here to avoid duplicate toasts
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

  const userData = JSON.parse(localStorage.getItem("_us_unr")) || {};
  const isProfessor = userData.role === 'professor';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{group.group_name}</h3>
            <div className="flex items-center mt-2 text-gray-600">
              <UsersIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{group.students?.length || 0} students</span>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <Link
              to={`/professor/group/${group._id}/statistics?groupName=${encodeURIComponent(group.group_name)}`}
              className="text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1"
            >
              View
            </Link>
            {isProfessor && (
              <>
                <Link
                  to={`/professor/group/${group._id}/edit`}
                  className="text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md px-3 py-1"
                  title="Delete Group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description || 'No description provided'}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <button
            onClick={handleCopyLink}
            disabled={isLoading}
            className={`text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Invite Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
