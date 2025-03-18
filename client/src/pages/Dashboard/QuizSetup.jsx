import React, { useState } from 'react';
import { ChevronRight, Brain, Target, HelpCircle} from 'lucide-react';
import {Select, SelectItem} from "@heroui/react";

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

export default function QuizSetup({ onStartQuiz }) {
  const [questionType, setQuestionType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartQuiz({
      type: questionType,
      difficulty,
      questionCount
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900  mb-2">Quiz Setup</h1>
        <p className="text-gray-600 ">Customize your quiz experience</p>
      </div>

      <div className="grid grid-cols-1  gap-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUESTION_TYPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setQuestionType(id)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${questionType === id
                    ? 'border-blue-500 bg-blue-50 '
                    : 'border-gray-200  hover:border-blue-300'
                  }
                `}
              >
                <Icon className={`h-8 w-8 mb-2 mx-auto ${
                  questionType === id ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-center">{label}</div>
              </button>
            ))}
          </div>

        {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 ">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {DIFFICULTY_LEVELS.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setDifficulty(id)}
                          className={`
                            py-2 px-4 rounded-md text-sm font-medium transition-all
                            ${difficulty === id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100  text-gray-700  hover:bg-gray-200 '
                            }
                          `}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count */}
                  <div className="space-y-2">
                    <div className="relative">
                        <Select
                            disableSelectorIconRotation
                            className="max-w-4xl"
                            label="Number of Questions"
                            labelPlacement="outside"
                            placeholder="Select Number of Questions"
                            SelectedKeys={[10]}
                            renderValue={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            >
                                {[5, 10, 15, 20].map(num => (
                                <SelectItem key={num} textValue={num}>{num}  questions</SelectItem>
                            ))}
                        </Select>
                    </div>
                  </div>

                  {/* Start Button */}
                <button
                    type="submit"
                    disabled={!questionType || !difficulty}
                    className={`
                    w-full flex items-center justify-center py-3 px-4
                    rounded-md text-sm font-medium transition-all
                    ${!questionType || !difficulty
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                    `}
                >
                    Start Quiz
                    <ChevronRight className="ml-2 h-4 w-4" />
                </button>
        </form>
      </div>
    </div>
  );
}