import React, { useState } from 'react';
import { ArrowLeft, Copy, Share2, Settings, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function QuizPreview({ quiz }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const navigate = useNavigate();
  
  // Mock quiz data - replace with actual quiz from props
  const quizData = {
    title: "Chapter 5: World History",
    questions: [
      {
        question: "Who was the first Emperor of China?",
        options: ["Qin Shi Huang", "Sun Tzu", "Confucius", "Liu Bang"],
        correctAnswer: "Qin Shi Huang"
      },
      {
        question: "Which dynasty ruled China the longest?",
        options: ["Ming", "Han", "Zhou", "Qing"],
        correctAnswer: "Zhou"
      }
    ],
    settings: {
      timeLimit: "30 mins",
      difficulty: "Medium",
      type: "Multiple Choice"
    }
  };

  const copyLink = () => {
    // Mock copy function - replace with actual sharing logic
    navigator.clipboard.writeText(`https://prepgenius.com/quiz/${123}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareQuiz = () => {
    // Mock share function - replace with actual sharing logic
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/professor/upload"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Upload
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Preview</h1>
        <div className="w-20"></div>
      </div>

      {/* Quiz Info Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{quizData.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              {isCopied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={shareQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>

        {/* Quiz Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Time Limit</p>
            <p className="font-medium">{quizData.settings.timeLimit}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="font-medium">{quizData.settings.difficulty}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{quizData.settings.type}</p>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Questions ({quizData.questions.length})</h3>
          {quizData.questions.map((q, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((option, i) => (
                  <div key={i} className={`p-2 rounded border ${
                    option === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    {option}
                    {option === q.correctAnswer && (
                      <Check className="h-4 w-4 text-green-500 inline ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/professor/quizzes')}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          View All Quizzes
        </button>
        <button
          onClick={() => navigate('/professor/upload')}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Another Quiz
        </button>
      </div>
    </div>
  );
}