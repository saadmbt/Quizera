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
    const  user = JSON.parse(localStorage.getItem("_us_unr")) || {};
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
    }, []);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                {error === "No groups found for this student" ? (
                    <>
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Groups Yet</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            You haven't joined any groups at this moment. Join a group to start collaborating with others!
                        </p>
                    </>
                ) : (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 mb-8 shadow-lg">
                <div className="flex flex-col   items-center  md:items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">
                        My Learning Groups
                    </h1>
                </div>

                {/*  Search Bar */}
                <div className="mt-4">
                    <div className="relative max-w-xl mx-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your groups..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full 
                                     text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50
                                     transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Groups Container with Animation */}
            <div className="  p-6 ">
                {/* Group List or Empty State */}
                {groups.length > 0 ? (
                    <div className="animate-fadeIn">
                        <ListGroups groups={groups} searchQuery={searchQuery} />
                    </div>
                ) : (
                    <div className="text-center py-12 animate-fadeIn">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Groups Yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Ready to collaborate? Join your first group to start learning together!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Groupspage;
