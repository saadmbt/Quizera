import React, { useEffect, useState } from 'react';
import ProgressOverviewCard from './ProgressOverviewCard';
import { BookOpen, BrainCircuit, Crown } from 'lucide-react';
import { fetchStudentPerformance } from '../../services/StudentService';
const ProgressOverviewSection = () => {
  const [Loading, setLoading] = useState(true);
  const [stats, setstats] = useState([]);

  const x = [
    { title: 'Completed Quizzes', value: '24', color: 'bg-blue-500', icon: BookOpen },
    { title: 'Average Score', value: '92%', color: 'bg-green-500', icon: BrainCircuit },
    { title: 'Study Streak', value: '7 days', color: 'bg-orange-500', icon: Crown }
  ];
  useEffect(()=>{
      fetchStudentPerformance().then((data) => {
        console.log('Student Performance:', data);
        setstats([
          { title: 'Completed Quizzes', value: data.totalQuizzes, color: 'bg-blue-500', icon: BookOpen },
          { title: 'Average Score', value: `${data.averageScore}%`, color: 'bg-green-500', icon: BrainCircuit },
          { title: 'Study Streak', value: '7 days', color: 'bg-orange-500', icon: Crown }
        ])
      }).catch((error) => {
        console.error('Error fetching student performance:', error);
      }).finally(() => {
        setLoading(false);
      })
  },[])



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4 md:px-0">
      {Loading && [...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-200 h-8 w-8 rounded-full"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>
          <div className="bg-gray-200 h-6 w-full rounded mt-2"></div>
          <div className="bg-gray-200 h-2 w-full rounded mt-4"></div>
        </div>))}
      {/* Render the loading skeletons */}
      
      {/* Render the ProgressOverviewCard components */}
     {!Loading &&  stats.map((stat) => (
        <ProgressOverviewCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          color={stat.color}
          Icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default ProgressOverviewSection;