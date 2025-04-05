import React, { useEffect, useState } from 'react';
import { ChevronRight, Brain, Target, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const QUESTION_TYPES = [
  { id: 'multiple-choice', label: 'Multiple Choice', icon: Brain },
  { id: 'true-false', label: 'True/False', icon: Target },
  { id: 'fill-blank', label: 'Fill in the Blank', icon: HelpCircle }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

const GROUPS = [
  { id: 'group1', label: 'Computer Science 101' },
  { id: 'group2', label: 'Mathematics 202' },
  { id: 'group3', label: 'Physics 303' }
];

export default function QuizSetup({ onStartQuiz }) {
  const [questionType, setQuestionType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfessor = location.pathname.includes('professor');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const quizData = {
      type: questionType,
      difficulty,
      questionCount,
      sharedWith: isProfessor ? selectedGroup : null
    };
    
    try {
      if (isProfessor) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        navigate('/professor/upload/quizpreview', { state: { quizData }});
      } else {
        onStartQuiz(quizData);
        navigate('/quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progress = [
    !!questionType,
    !!difficulty,
    isProfessor ? !!selectedGroup : true
  ].filter(Boolean).length;

  const totalSteps = isProfessor ? 3 : 2;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <div className="text-center">
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          {isProfessor ? 'Create Quiz' : 'Start Your Quiz'}
        </motion.h1>
        <p className="text-gray-600 text-lg">
          {isProfessor 
            ? 'Design a quiz and share it with your students' 
            : 'Customize your quiz experience'}
        </p>

        {/* Progress bar */}
        <div className="mt-6 relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-sm text-gray-600">
              {progress} of {totalSteps} steps completed
            </div>
          </div>
          <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress / totalSteps) * 100}%` }}
              className="bg-blue-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Type Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Select Question Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUESTION_TYPES.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setQuestionType(id)}
                  className={`
                    p-6 rounded-lg border-2 transition-all
                    ${questionType === id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  <Icon className={`h-10 w-10 mb-3 mx-auto ${
                    questionType === id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <div className="text-base font-medium text-center">{label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Select Difficulty Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DIFFICULTY_LEVELS.map(({ id, label }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setDifficulty(id)}
                  className={`
                    py-3 px-6 rounded-lg text-base font-medium transition-all
                    ${difficulty === id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              Number of Questions: {questionCount}
            </label>
            <div className="px-2">
              <input
                type="range"
                min="5"
                max="20"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Group Selection (only for professors) */}
          {isProfessor && (
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Share with Group
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GROUPS.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setSelectedGroup(id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${selectedGroup === id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="text-base font-medium">{label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!questionType || !difficulty || (isProfessor && !selectedGroup) || isLoading}
            className={`
              w-full flex items-center justify-center py-4 px-6
              rounded-lg text-base font-medium transition-all
              ${!questionType || !difficulty || (isProfessor && !selectedGroup) || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <>
                {isProfessor ? 'Create & Share Quiz' : 'Start Quiz'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}