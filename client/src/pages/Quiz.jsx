import React, { useState, useEffect, useCallback } from 'react';
import { Timer, CheckCircle, XCircle, BarChart, Brain, Youtube } from 'lucide-react';


// Mock questions for demonstration
const MOCK_QUESTIONS= [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    id: 3,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean"
  }
];

export default function Quiz({ settings }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState(null);
  
  const score = answers.filter(answer => answer.isCorrect).length;
  const keywords = ['geography', 'capitals', 'planets', 'oceans']; // Example keywords

  useEffect(() => {
    let interval
    try {
      interval = window.setInterval(() => {
        if (!quizComplete) {
          setTimer(prev => prev + 1);
        }
      }, 1000);
    } catch (err) {
      setError('Timer initialization failed');
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [quizComplete]);

  useEffect(() => {
    try {
      setStartTime(Date.now());
    } catch (err) {
      setError('Failed to start timer');
    }
  }, [currentQuestion]);

  const handleAnswer = useCallback((selectedAnswer) => {
    try {
      const question = MOCK_QUESTIONS[currentQuestion];
      const isCorrect = selectedAnswer === question.correctAnswer;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      setAnswers(prev => [...prev, {
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        time: timeSpent
      }]);

      if (currentQuestion < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setQuizComplete(true);
      }
    } catch (err) {
      setError('Failed to process answer');
      setTimeout(() => setError(null), 3000);
    }
  }, [currentQuestion, startTime]);

 

  if (quizComplete) {
    const scorePercentage = Math.round((score / MOCK_QUESTIONS.length) * 100);
    const isLowScore = scorePercentage < 70; // Below 70% is considered low

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete!</h2>
          
          {/* Score Summary */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-blue-500">
              {scorePercentage}%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {score} out of {MOCK_QUESTIONS.length} correct
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Breakdown
            </h3>
            
            {/* Average Time */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Time per Question</div>
              <div className="text-xl font-semibold">
                {Math.round(answers.reduce((acc, curr) => acc + curr.time, 0) / answers.length)} seconds
              </div>
            </div>

            {/* Accuracy Chart */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(score / MOCK_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {isLowScore && (
            <>
              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="text-sm space-y-2">
                  <li>• Review the material with our generated flashcards</li>
                  <li>• Watch recommended video explanations</li>
                  <li>• Focus on topics where you scored lowest</li>
                  <li>• Practice with similar questions to build confidence</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowFlashcards(true)}
                  className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Brain className="h-5 w-5" />
                  Study Flashcards
                </button>
                <button
                  onClick={() => setShowVideos(true)}
                  className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors"
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

  const question = MOCK_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      
      {/* Progress and Timer */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{currentQuestion + 1} of {MOCK_QUESTIONS.length}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 ml-4">
          <Timer className="h-5 w-5 mr-2" />
          <span>{timer}s</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <span className="font-medium">{letter}.</span> {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback */}
      {answers.length > 0 && answers[answers.length - 1].questionId === MOCK_QUESTIONS[currentQuestion - 1]?.id && (
        <div className={`flex items-center p-4 rounded-lg ${
          answers[answers.length - 1].isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {answers[answers.length - 1].isCorrect ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          {answers[answers.length - 1].isCorrect ? 'Correct!' : 'Incorrect'}
        </div>
      )}
    </div>
  );
}