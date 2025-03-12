import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import GroupList from './GroupList';
import GroupForm from './GroupForm';
import { fetchProfessorGroups, createGroup } from '../../services/ProfServices';
import {AuthContext} from "../Auth/AuthContext"


const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useContext(AuthContext); 
  const profId=user.uid

  // Fetch groups from the API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await fetchProfessorGroups(profId);
        setGroups(data);
      } catch (error) {
        toast.error('Failed to fetch groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [profId]);

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
  const handleCreateGroup = async (newGroup) => {
    try {
      const data = await createGroup(newGroup);
      setGroups((prevGroups) => [...prevGroups, data]);
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group');
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

      {/* Group List or Loading Message */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <GroupList groups={groups} searchQuery={searchQuery} />
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