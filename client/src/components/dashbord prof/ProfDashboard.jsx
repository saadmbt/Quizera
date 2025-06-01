import React, { useEffect, useState } from 'react';
import { UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import StatCard from './StatCard';
import GroupCard from './GroupCard';
import { fetchProfessorGroups, fetchGroupStudentsWithScores } from '../../services/ProfServices';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const ProfDashboard = () => {
  const user= JSON.parse(localStorage.getItem('_us_unr')) || {};
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState({
    activeGroups: 0,
    totalStudents: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const groupsData = await fetchProfessorGroups(user);
        // Removed console.log to prevent clutter and potential loop
        setGroups(groupsData);

        // Calculate stats from groupsData
        const activeGroups = groupsData.length;
        const totalStudents = groupsData.reduce((acc, group) => {
          return acc + (group.students ? group.students.length : 0);
        }, 0);

        // Fetch students with scores for each group and calculate average scores
        let totalScoreSum = 0;
        let totalScoreCount = 0;

        await Promise.all(groupsData.map(async (group) => {
          try {
            const studentsWithScores = await fetchGroupStudentsWithScores(group._id);
            console.log(`Group ${group._id} studentsWithScores:`, studentsWithScores);
            const groupScoreSum = studentsWithScores.reduce((sum, student) => sum + (student.averageScore || 0), 0);
            const groupScoreCount = studentsWithScores.length;
            if (groupScoreCount > 0) {
              totalScoreSum += groupScoreSum;
              totalScoreCount += groupScoreCount;
            }
          } catch (error) {
            console.error(`Error fetching scores for group ${group._id}:`, error);
          }
        }));

        const averageScore = totalScoreCount > 0 ? totalScoreSum / totalScoreCount : 0;

        setStats({
          activeGroups,
          totalStudents,
          averageScore: parseFloat(averageScore.toFixed(1)),
        });
      } catch (error) {
        console.error('Error fetching professor groups:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
        <div className="bg-gray-200 w-12 h-12 px-4 py-2 rounded-full font-semibold text-2xl flex items-center justify-center text-gray-600">
            {user.username?.[0] || 'P'}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Welcome back, {user.username}</h1>
            <p className="text-gray-600">Manage your classes and content</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Groups"
          value={stats.activeGroups}
          color="blue"
          percentage={stats.activeGroups > 0 ? 100 : 0}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          color="green"
          percentage={stats.totalStudents > 0 ? 100 : 0}
        />
        <StatCard
          title="Average Score"
          value={stats.averageScore}
          color="yellow"
          percentage={Math.min(stats.averageScore * 10, 100)}
        />
      </div>

      {/* Groups */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Groups</h2>
        {groups.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
              <UserGroupIcon className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first group</p>
            <button
              onClick={()=>{navigate('/professor/groups')}}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Group
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group._id}
              name={group.group_name || group.name}
              count={`${group.students ? group.students.length : 0} students`}
              groupId={group._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfDashboard;
