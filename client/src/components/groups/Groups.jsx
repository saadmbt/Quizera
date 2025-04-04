import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import { fetchProfessorGroups, createGroup } from '../../services/ProfServices';
import { AuthContext } from "../Auth/AuthContext";

const  Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch groups from the API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log('Fetching groups for user:', user); // Debug log
        if (!user || !user.uid) {
          console.error('User or user.uid is undefined');
          return;
        }
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
  }, [user]);

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
      // Send the data to the API
      const createdGroup = await createGroup({
        name: groupData.name,
        description: groupData.description
      }, user);
      
      // Add the new group to the local state
      setGroups((prevGroups) => [...prevGroups, createdGroup]);
      
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group. Please check your input and try again.');
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
        <div className="flex justify-center py-8">
          <p>Loading...</p>
        </div>
      ) : groups.length > 0 ? (
        <GroupList groups={groups} searchQuery={searchQuery} />
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No groups found. Create a new group to get started.</p>
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