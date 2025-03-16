import React from 'react'
import ProgressOverviewSection from '../../components/dashboard/ProgressOverviewSection';
import { useOutletContext } from 'react-router-dom';

import Header from '../../components/dashboard/Header'
import QuizHistory from '../../components/dashboard/QuizHistory';
import { History } from 'lucide-react';
function Studentmainpage() {
    const { toggleSidebar } = useOutletContext();

  return (
    <>
        <Header onToggleSidebar={toggleSidebar} />
        <ProgressOverviewSection />
        {/* Recent Quizzes */}
        <div className="mb-8 px-4 md:px-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold ">Recent Quizzes</h2>
            </div>
          </div>
          <QuizHistory limit={3} showViewAll={true} />
        </div>
    </>
  )
}

export default Studentmainpage
