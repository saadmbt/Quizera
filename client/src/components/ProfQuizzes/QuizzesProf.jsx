import React from 'react'
import { History } from 'lucide-react'
import QuizHistoryProf from './QuizzHistoryProf';

function QuizzesProf() {
  return (
    <>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold ">Quiz History</h2>
          </div>
          <QuizHistoryProf />
        </div>
    </>
        
  )
}

export default QuizzesProf;