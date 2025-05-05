import React, { useState } from 'react';
import { ArrowLeft, Copy, Share2, Settings, Check, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function QuizPreview() {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz;

  // Use quiz from location state, safely handle missing settings
  const quizData = quiz || {
    title: "No quiz data available",
    questions: [],
    settings: {}
  };
  console.log("QuizPreview quizData.settings.dueDate:", quizData.settings?.dueDate);

  // Provide defaults for settings fields to avoid undefined errors
  const timeLimit = quizData.settings?.timeLimit || "N/A";
  const difficulty = quizData.settings?.difficulty || "N/A";
  const type = quizData.settings?.type || "N/A";

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
        </div>

        {/* Quiz Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">
              {quizData.settings?.dueDate && !isNaN(new Date(quizData.settings.dueDate).getTime())
                ? new Date(quizData.settings.dueDate).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                : "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="font-medium">{difficulty}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{type}</p>
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
                    option === q.correctanswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    {option}
                    {option === q.correctanswer && (
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