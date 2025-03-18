import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import { fetchProfessorGroups, createGroup } from '../../services/ProfServices';
import { AuthContext } from "../Auth/AuthContext";

const Groups = () => {
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
  });

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch groups from the API
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user || !user.uid) {
        setIsLoading(false);
        return;
      }

      try {
const data = await fetchProfessorGroups(user.uid);
if (Array.isArray(data)) {
  setGroups(data);
} else {
  toast.error('Unexpected data format received');
}

        setGroups(data);
      } catch (error) {
        toast.error('Failed to fetch groups');
        console.error('Error fetching groups:', error);
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

    // Log the group data before creating it
    console.log('Creating group with data:', groupData);

    try {
      // Send the data to the API
      const createdGroup = await createGroup({
        name: groupData.name,
        description: groupData.description
      }, user);
      console.log(createdGroup);
      
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
    <div className="p-8">
      {/* Header and Create Group Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button
          onClick={handleModalOpen}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="mb-4 text-sm text-gray-500">
          Professor ID: {user.uid}
        </div>
      )}

      {/* Group List or Loading Message */}
      {isLoading ? (
        <p>Loading...</p>
      ) : groups.length > 0 ? (
        <GroupList groups={groups} searchQuery={searchQuery} />
      ) : (
        <p className="text-center text-gray-500 py-8">No groups found. Create a new group to get started.</p>
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
