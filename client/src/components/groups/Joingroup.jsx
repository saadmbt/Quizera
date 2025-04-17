import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../Auth/AuthContext';

const JoinGroup = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext); 
  console.log("User:", user); // Log the user state
  console.log("Is Authenticated:", isAuthenticated); // Log the authentication state
  const [groupInfo, setGroupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        if (!user || !user.uid) {
          console.log('User not authenticated, redirecting to login');
          localStorage.setItem('redirectAfterLogin', `/student/join-group/${token}`);
          navigate('/auth/login');
          return;
        }

        if (!token) {
          setError('Invitation token is missing.');
          return;
        }

        // Log the payload for debugging
        const payload = {
          token: token,
          uid: user.uid
        };
        console.log('Sending validation payload:', payload);

        const response = await axios.post(
          'https://prepgenius-backend.vercel.app/api/validate-invite-token',
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Validation response:', response.data);
        setGroupInfo(response.data);
      } catch (error) {
        console.error('Validation error:', error.response || error);
        setError(error.response?.data?.error || 'Unable to validate invitation token');
      } finally {
        setIsLoading(false);
      }
    };

    validateInvitation();
  }, [token, user, navigate]);

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        'https://prepgenius-backend.vercel.app/api/groups/join',
        { 
          token,
          uid: user.uid 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('Successfully joined group');
      navigate('/Student/groups/1');
    } catch (error) {
      console.error('Join error:', error);
      if (error.response?.status === 401) {
        localStorage.setItem('redirectAfterLogin', `/student/join-group/${token}`);
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.error || 'Failed to join group');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
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
