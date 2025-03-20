import React, { useState } from 'react';
import { KeyIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const SecuritySettings = ({ userType }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Handle password change
  };

  const passwordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white rounded-lg">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <KeyIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Change Password
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-1/4 rounded-full ${getPasswordStrengthColor(
                          i < passwordStrength(newPassword) ? passwordStrength(newPassword) : 0
                        )}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Password strength: {
                      passwordStrength(newPassword) === 0 ? 'Too weak' :
                      passwordStrength(newPassword) === 1 ? 'Weak' :
                      passwordStrength(newPassword) === 2 ? 'Fair' :
                      passwordStrength(newPassword) === 3 ? 'Good' :
                      'Strong'
                    }
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SecuritySettings;