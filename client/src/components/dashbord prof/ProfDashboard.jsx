import React, { useEffect, useState, useContext } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import StatCard from './StatCard';
import GroupCard from './GroupCard';
import { fetchProfessorGroups } from '../../services/ProfServices';
import { AuthContext } from '../Auth/AuthContext';

const ProfDashboard = () => {
  const { user } = useContext(AuthContext);
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
        console.log('Groups data fetched in ProfDashboard:', groupsData);
        setGroups(groupsData);

        // Calculate stats from groupsData
        const activeGroups = groupsData.length;
        const totalStudents = groupsData.reduce((acc, group) => {
          // Sum the length of students array if present
          return acc + (group.students ? group.students.length : 0);
        }, 0);
        // For averageScore, assuming groupsData has averageScore property or calculate accordingly
        const averageScore = groupsData.length > 0
          ? groupsData.reduce((acc, group) => acc + (group.averageScore || 0), 0) / groupsData.length
          : 0;

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
  }, [user]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <UserCircleIcon className="w-12 h-12 text-gray-400" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Welcome back, Professor</h1>
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
          percentage={stats.averageScore * 10}
        />
      </div>

      {/* Groups */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Groups</h2>
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
