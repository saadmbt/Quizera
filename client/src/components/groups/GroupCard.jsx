import React, { useContext, useState } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { copyInviteLink } from '../../services/ProfServices';
import { AuthContext } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const [isLoading, setIsLoading] = useState(false);
  
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
          <div className="space-x-3">
            <Link
              to={`/professor/group/${group._id}/statistics?groupName=${encodeURIComponent(group.group_name)}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              View
            </Link>
            <Link
              to={`/professor/group/${group._id}/edit`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;