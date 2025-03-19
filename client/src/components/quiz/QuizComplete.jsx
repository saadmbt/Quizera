import React from 'react';
import { BarChart, Brain, Youtube } from 'lucide-react';
import ScoreSummary from '../dashboard/ScoreSummary';

//  QuizCompleteProps {
//   score: number;
//   totalQuestions: number;
//   answers: Array<{ time: number }>;
//   onShowFlashcards: () => function;
//   onShowVideos: () => function;
// }

export default function QuizComplete({ score, totalQuestions, answers,onShowFlashcards
    ,onShowVideos }) {
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const isLowScore = scorePercentage < 70;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white  rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete!</h2>
        
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-500">
            {scorePercentage}%
          </div>
          <div className="text-gray-600 ">
            {score} out of {totalQuestions} correct
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Performance Breakdown
          </h3>
          <ScoreSummary  quizLenght={totalQuestions} answers={answers} />

          <div className="bg-gray-50  rounded-lg p-4">
            <div className="text-sm text-gray-600 ">Average Time per Question</div>
            <div className="text-xl font-semibold">
              {Math.round(answers.reduce((acc, curr) => acc + curr.time, 0) / answers.length)} seconds
            </div>
          </div>

          <div className="h-4 bg-gray-200  rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(score / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {isLowScore && (
          <>
            <div className="bg-blue-50  rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="text-sm space-y-2">
                <li>• Review the material with our generated flashcards</li>
                <li>• Watch recommended video explanations</li>
                <li>• Focus on topics where you scored lowest</li>
                <li>• Practice with similar questions to build confidence</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onShowFlashcards}
                className="flex items-center justify-center gap-2 p-4 bg-white  rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50  transition-colors"
              >
                <Brain className="h-5 w-5" />
                Study Flashcards
              </button>
              <button
                onClick={onShowVideos}
                className="flex items-center justify-center gap-2 p-4 bg-white  rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50  transition-colors"
              >
                <Youtube className="h-5 w-5" />
                Watch Videos
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}