import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import StatCard from './StatCard';
import LessonCard from './LessonCard';
import GroupCard from './GroupCard';

const Dashboard = () => {
  const recentLessons = [
    { title: 'Advanced Grammar', subject: 'English' },
    { title: 'Business Vocabulary', subject: 'Spanish' },
    { title: 'Conversation Practice', subject: 'French' },
  ];

  const groups = [
    { name: 'Essential Phrases', count: '50 students' },
    { name: 'Grammar Rules', count: '30 students' },
    { name: 'Vocabulary', count: '100 students' },
  ];

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
          value="25"
          color="blue"
          percentage={75}
        />
        <StatCard
          title="Total Students"
          value="92"
          color="green"
          percentage={92}
        />
        <StatCard
          title="Average Score"
          value="7.8"
          color="yellow"
          percentage={78}
        />
      </div>

      {/* Recent Lessons */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLessons.map((lesson, index) => (
            <LessonCard
              key={index}
              title={lesson.title}
              subject={lesson.subject}
            />
          ))}
        </div>
      </div>

      {/* Groups */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <GroupCard
              key={index}
              name={group.name}
              count={group.count}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;