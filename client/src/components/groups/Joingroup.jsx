import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../Auth/AuthContext';  // Import your authentication context

const JoinGroup = () => {
  const { token } = useParams();  // Get the token from the URL params
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);  // Get authentication state
  const [groupInfo, setGroupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if the student is not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/join-group/${token}` }});  // Redirect to login with the current URL as the return path
      return;
    }

    const validateInvitation = async () => {
      try {
        // Validate the invitation token
        const response = await axios.post(
          'https://prepgenius-backend.vercel.app/api/validate-invite-token',
          { token },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );

        // Set the group information from the response
        setGroupInfo(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Invalid or expired invitation link');
      } finally {
        setIsLoading(false);
      }
    };

    validateInvitation();
  }, [token, isAuthenticated, navigate]);

  const handleJoinGroup = async () => {
    try {
      await axios.post(
        'https://prepgenius-backend.vercel.app/api/groups/join',
        { token },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      toast.success('Successfully joined group');
      navigate('/dashboard');  // Redirect to the dashboard after joining
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to join group');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Group</h2>
        
        <div className="mb-6">
          <p className="text-lg mb-2">
            <span className="font-semibold">Group:</span> {groupInfo?.group_name}
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Professor:</span> {groupInfo?.professor_name}
          </p>
          <p className="text-gray-600 mb-6">
            You are about to join this group. Once you join, you'll have access to all group resources.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleJoinGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;