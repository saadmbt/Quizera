import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import GroupList from '../../components/groups/GroupList';
import ListGroups from '../../components/dashboard/groups/ListGroups';

function Groupspage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [groups, setGroups] = useState([
        { id: 1, name: 'Group 1', description: 'This is group 1', quizzes: [
            {quiz_id: 1, title: 'This is quiz 1',created_at:"2025-04-01",completed:true},{},{}],created_at:'2025-03-05',members:20 },
        { id: 2, name: 'Group 2', description: 'This is group 2', quizzes: [] },
        { id: 3, name: 'Group 3', description: 'This is group 3', quizzes: [] },
        { id: 4, name: 'Group 4', description: 'This is group 4', quizzes: [] },
    ]);
    // Handle search input change
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };
  return (
    <div className="container mx-auto p-4">
        {/* Header and Create Group Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Groups</h1>
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
        <div className="bg-white rounded-lg shadow-md p-8">
            {/* Group List or Loading Message */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                <p>Loading...</p>
                </div>
            ) : groups.length > 0 ? (
                <ListGroups groups={groups} searchQuery={searchQuery} />
            ) : (
                <div className="text-center text-gray-500 py-8">
                <p>No groups found. Create a new group to get started.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Groupspage