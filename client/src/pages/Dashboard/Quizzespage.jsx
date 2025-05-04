import React from 'react'
import QuizHistory from '../../components/dashboard/QuizHistory'
import { History } from 'lucide-react'

function Quizzespage() {
  return (
    <>
        {/* Quiz History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold ">Quiz History</h2>
          </div>
          <QuizHistory />
        </div>
    </>
        
  )
}

export default Quizzespage