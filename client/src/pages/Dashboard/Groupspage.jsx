import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect, useContext } from 'react'
import ListGroups from '../../components/dashboard/groups/ListGroups';
import { fetchStudentGroups } from '../../services/ProfServices';
import { AuthContext } from '../../components/Auth/AuthContext';

function Groupspage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    // Handle search input change
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const loadGroups = async () => {
            if (!user) {
                setError('User not logged in');
                setIsLoading(false);
                return;
            }
            try {
                const data = await fetchStudentGroups(user.uid);
                setGroups(data);
            } catch (err) {
                setError('Failed to fetch groups');
            } finally {
                setIsLoading(false);
            }
        };
        loadGroups();
    }, [user]);

    if (isLoading) {
        return <div className="flex justify-center py-8">Loading groups...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">My Groups</h1>
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
                {/* Group List or No Groups Message */}
                {groups.length > 0 ? (
                    <ListGroups groups={groups} searchQuery={searchQuery} />
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>You have not joined any groups yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Groupspage;
