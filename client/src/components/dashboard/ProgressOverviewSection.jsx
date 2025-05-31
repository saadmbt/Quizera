import React, { useEffect, useState } from 'react';
import ProgressOverviewCard from './ProgressOverviewCard';
import { BookOpen, BrainCircuit, Crown } from 'lucide-react';
import { fetchStudentPerformance } from '../../services/StudentService';
const ProgressOverviewSection = () => {
  const [Loading, setLoading] = useState(true);
  const [stats, setstats] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchWithRetry = async (retryCount = 1) => {
      try {
        const data = await fetchStudentPerformance();
        if (!isMounted) return;

        if (!data) throw new Error('No data received');

        const formattedStats = [
          { 
            title: 'Completed Quizzes', 
            value: data.totalQuizzes || 0, 
            color: 'bg-blue-500', 
            icon: BookOpen 
          },
          { 
            title: 'Average Score', 
            value: `${Math.round(data.averageScore || 0)}%`, 
            color: 'bg-green-500', 
            icon: BrainCircuit 
          },
          { 
            title: 'Study Streak', 
            value: `${data.totalQuizzes<5?data.streak || 0 : 5} days`, 
            color: 'bg-orange-500', 
            icon: Crown 
          }
        ];

        setstats(formattedStats);
      } catch (error) {
        console.error(`Attempt ${retryCount} failed:`, error.message);
        if (retryCount < 3 && isMounted) {
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchWithRetry(retryCount + 1);
        }
        // If all retries fail, set empty stats
        if (isMounted) setstats([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWithRetry();

    return () => {
      isMounted = false;
    };
  }, []);



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