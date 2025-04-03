import React from 'react';
import { Timer } from 'lucide-react';

// Props {
//   currentQuestion: number;
//   totalQuestions: number;
//   timer: number;
// }

export default function QuizProgress({ currentQuestion, totalQuestions, timer }) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="w-full max-w-xl">
        <div className="flex justify-between text-sm text-gray-600  mb-2">
          <span>Progress</span>
          <span>{currentQuestion + 1} of {totalQuestions}</span>
        </div>
        <div className="h-2  bg-gray-200  rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center text-gray-600  ml-4">
        <Timer className="h-5 w-5 mr-2" />
        <span>{timer}s</span>
      </div>
    </div>
  );
}