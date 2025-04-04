import React from 'react';
import { BarChart, Brain, ChevronRight, Share, Share2, Youtube } from 'lucide-react';
import ScoreSummary from '../dashboard/ScoreSummary';

//  Props {
//   score: number;
//   totalQuestions: number;
//   answers: Array;
//   onShowFlashcards: () => function;
//   onShowVideos: () => function;
// }

export default function QuizComplete({ score, totalQuestions, answers,onShowFlashcards
    ,onShowVideos, onshowQuestions}) {
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const isLowScore = scorePercentage < 70;
  const incorrectanswers = answers.filter(answer => !answer.isCorrect).length;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>
      
      {/* Score Display */}
      <div className="text-center">
        <div className={`text-5xl font-bold mb-2 ${scorePercentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
        {scorePercentage}%
        </div>
        <div className="text-gray-600 mb-4">
        {score} out of {totalQuestions} correct
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${scorePercentage >= 70 ? 'bg-green-500' : 'bg-orange-500'} transition-all duration-500 ease-out`}
          style={{ width: `${(score / totalQuestions) * 100}%` }}
        />
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2 justify-between">
          <div className='flex items-center gap-2'>
            <BarChart className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Performance Breakdown</h3>
          </div>
          {/* share quiz button to copy quiz link */}
          <button className="btn btn-primary py-1 hover:transition-all duration-300 transform hover:scale-105 " onClick={onShowFlashcards}>
            <Share2 className="h-5 w-5 text-white mr-2 " />
            Share Quiz
          </button>
        </div>
        <ScoreSummary quizLenght={totalQuestions} correctAnswers={score} incorrectAnswers={incorrectanswers} />

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div className="text-sm text-gray-600">Average Time per Question</div>
        <div className="text-2xl font-semibold text-blue-600">
          {Math.round(answers.reduce((acc, curr) => acc + curr.time, 0) / answers.length)} seconds
        </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-lg">Questions Review</h3>
        <div className="flex items-center space-x-2 cursor-pointer hover:transition-all duration-300 transform hover:scale-105" 
        onClick={onshowQuestions}
        >
          <span className="text-medium text-blue-600">
            {answers.length} questions 
          </span>
          <ChevronRight className="h-5 w-5 text-blue-600" />
        </div>
      </div>
  
      {/* Recommendations for low scores */}
      {isLowScore && (
        <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Recommendations for Improvement</h3>
          <ul className="text-sm space-y-3 text-blue-700">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Review the material with our generated flashcards
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Watch recommended video explanations
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Focus on topics where you scored lowest
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Practice with similar questions to build confidence
          </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
          onClick={onShowFlashcards}
          className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
          <Brain className="h-5 w-5" />
          Study Flashcards
          </button>
          <button
          onClick={onShowVideos}
          className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
          >
          <Youtube className="h-5 w-5" />
          Watch Videos
          </button>
        </div>
        </div>
      )}
      </div>
    </div>
    );
}