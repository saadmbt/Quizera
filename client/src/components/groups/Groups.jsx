import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon,UserGroupIcon } from '@heroicons/react/24/outline';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import { fetchProfessorGroups, createGroup } from '../../services/ProfServices';
import { AuthContext } from "../Auth/AuthContext";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}
  
  // Fetch groups from the API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!user || !user.uid) {
          console.error('User or user.uid is undefined');
          return;
        }
        console.log('Fetching groups for user:', user); // Debug log
        const data = await fetchProfessorGroups(user);
  
        if (Array.isArray(data)) {
          setGroups(data);
          console.log('Groups fetched:', data); // Debug log
        } else {
          console.error('Expected array, got:', typeof data);
          toast.error('Unexpected data format received');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to fetch groups');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchGroups();
  }, [user.uid]);

  // Handle search input change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Open the modal
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle group creation
  const handleCreateGroup = async (groupData) => {
    if (!user || !user.uid) {
      toast.error('You must be logged in to create a group');
      return;
    }

    try {
      const newGroup = {
        name: groupData.name,
        description: groupData.description,
        prof_id: user.uid,
        prof_name: user.username,
      };
      
      const result = await createGroup(newGroup);
      
      // Add the new group to the local state with correct structure
      const formattedGroup = {
        _id: result.group_id,
        group_name: groupData.name,
        description: groupData.description,
        prof_id: user.uid,
        prof_name: user.username,
        students: []
      };
      
      setGroups(prevGroups => [...prevGroups, formattedGroup]);
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group. Please try again.');
      console.error('Error creating group:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header and Create Group Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Groups</h1>
        <button
          onClick={handleModalOpen}
          className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Display user ID for debugging if needed */}
      {user && user.uid && (
        <div className="mb-4 text-xs sm:text-sm text-gray-500">
          Professor ID: {user.uid}
        </div>
      )}

      {/* Group List or Loading Message */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center mb-4">
                <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between mt-6">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded inline-block"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded inline-block"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : groups.length > 0 ? (
        <GroupList groups={groups} searchQuery={searchQuery} />
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
            <UserGroupIcon className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first group</p>
          <button
            onClick={handleModalOpen}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Group
          </button>
        </div>
      )}

      {/* Group Form Modal */}
      {isModalOpen && (
        <GroupForm
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Groups;