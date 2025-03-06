import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserRoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Navigate to the subscription plan selection page
    navigate('/subscription-plan');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Which best describes you?</h2>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleRoleSelection('teacher')}
            className="w-full px-6 py-3 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Teacher
          </button>
          <button
            onClick={() => handleRoleSelection('business')}
            className="w-full px-6 py-3 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleSelection;