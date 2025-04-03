import React, { useContext, useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { copyInviteLink } from '../../services/ProfServices';
import { AuthContext } from '../Auth/AuthContext';

const GroupCard = ({ group }) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCopyLink = async () => {
    if (!user || !group._id) {
      toast.error('Missing required information');
      return;
    }

    setIsLoading(true);
    try {
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
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{group.group_name}</h3>
            <div className="flex items-center mt-2 text-gray-600">
              <UserGroupIcon className="w-4 h-4 mr-1" />
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
            className={`text-sm text-blue-600 hover:text-blue-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Generating...' : 'Copy Invite Link'}
          </button>
          <div className="space-x-2">
            <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
              View
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;