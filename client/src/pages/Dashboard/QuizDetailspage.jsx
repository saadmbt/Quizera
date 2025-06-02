import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar, Award, Brain, AlertCircle } from 'lucide-react';
import { PlaySquare } from 'lucide-react';
import ScoreSummary from '../../components/dashboard/ScoreSummary';
import { getQuizResultById } from '../../services/StudentService';
import { getQuizAttemptById } from '../../services/StudentService';
import Flashcards from '../../components/dashboard/Flashcards';
import Videos from '../../components/dashboard/Videos';


function QuizDetailspage() {
   const [quiz,setquiz]=useState({})
   const [loading,setloading]=useState({})
   const [showFlashcards,setShowFlashcards]=useState(false)
   const [showVideos,setShowVideos]=useState(false)

    const { id } = useParams();
    const fetchQuiz = useCallback(async () => {
      try{
        setloading(true);
        let history;
        try {
          history = await getQuizResultById(id);
        } catch (error) {
          console.warn("Quiz result not found, trying quiz attempt:", error);
        }
        if (!history) {
          try {
            history = await getQuizAttemptById(id);
          } catch (error) {
            console.error("Error fetching quiz attempt:", error);
          }
        }
        if (history && history.answers) {
          // If data is from quiz attempt, map answers to questions
          const mappedQuiz = {
            ...history,
            questions: history.answers
          };
          setquiz(mappedQuiz);
        } else {
          setquiz(history);
        }
      }catch (error) {
        console.error("Error fetching quiz history:", error);
      } finally {
        setloading(false);
      }

    }, [id]);

    useEffect(() => {
      fetchQuiz();
    }, []); 
    if (!quiz) {
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900  mb-2">Quiz Not Found</h2>
              <p className="text-gray-600  mb-6">The quiz you're looking for doesn't exist.</p>
              <Link
                to="/Student/quizzes"
                className="inline-flex items-center text-blue-600  hover:text-blue-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </div>
          </div>
        );
      }
      if (loading) return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    if (showFlashcards) {
      return (
        <Flashcards
          flashcards={quiz.flashcards}
          onBack={() => setShowFlashcards(false)}
        />
      );
  }

  if (showVideos) {
    return (
      <Videos videos={quiz.youtube} onBack={() => setShowVideos(false)} />
    );
  }
    const correctAnswers = quiz.questions ? quiz.questions.filter(q => q.isCorrect).length : 0;
    const quizLength = quiz.questions ? quiz.questions.length : 0;
    const incorrectAnswers = quizLength - correctAnswers;
 {/* Header */} 
return (
  <div className="max-w-4xl mx-auto p-6 space-y-8">
    <div className="flex items-center justify-between">
      <Link
        to="/Student/quizzes"
        className="flex items-center text-gray-600  hover:text-gray-900 "
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Quizzes
      </Link>
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-blue-500" />
        <h1 className="text-base md:text-2xl font-bold text-gray-900 ">{quiz.title}</h1>
      </div>
    </div>
      {/* General Information */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className={`grid ${!quiz.answers ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {quiz.submittedAt
                  ? new Date(quiz.submittedAt).toLocaleDateString()
                  : quiz.date
                  ? new Date(quiz.date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Time Spent</p>
              <p className="font-medium">
                {quiz.answers
                  ? quiz.answers.reduce((acc, curr) => acc + (curr.time || 0), 0) + " seconds"
                  : quiz.timeSpent
                  ? quiz.timeSpent + " seconds"
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-3 ${quiz.answers ? 'md:justify-center' : ''}`}>
            <Award className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="font-medium">
                {quiz.totalScore !== undefined
                  ? quiz.totalScore + "%"
                  : quiz.score !== undefined
                  ? quiz.score + "%"
                  : "N/A"}
              </p>
            </div>
          </div>
          {!quiz.answers && (
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{quiz.type || "N/A"}</p>
              </div>
            </div>
          )}
        </div><br /><br />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700">Total Questions</p>
            <p className="text-2xl font-semibold text-blue-900">{quizLength}</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700">Correct Answers</p>
            <p className="text-2xl font-semibold text-green-900">{correctAnswers}</p>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">Incorrect Answers</p>
            <p className="text-2xl font-semibold text-red-900">{incorrectAnswers}</p>
          </div>
        </div>
        
        {/* Questions & Answers */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questions & Answers</h2>
          {quiz.questions.map((question, index) => (
          <div key={index} className="bg-white  rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
              <div className="flex-1">
                  <h3 className="text-lg font-medium  mb-4">
                  {index + 1}. {question.question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, optionIndex) => (
                      <div
                      key={optionIndex}
                      className={`
                          p-4 rounded-lg border-2 transition-all
                          ${option === question.userAnswer && option === question.correctAnswer
                          ? 'border-green-500 bg-green-50 '
                          : option === question.userAnswer
                          ? 'border-red-500 bg-red-50 '
                          : option === question.correctAnswer
                          ? 'border-green-500 bg-green-50 '
                          : 'border-gray-200 '
                          }
                      `}
                      >
                      <div className="flex items-center justify-between">
                          <span className={`
                          ${option === question.correctAnswer
                              ? 'text-green-700 '
                              : option === question.userAnswer
                              ? 'text-red-700 '
                              : 'text-gray-700 '
                          }
                          `}>
                          {option}
                          </span>
                          {option === question.userAnswer && (
                          option === question.correctAnswer
                              ? <CheckCircle className="h-5 w-5 text-green-500" />
                              : <XCircle className="h-5 w-5 text-red-500" />
                          )}
                      </div>
                      </div>
                  ))}
                  </div>
              </div>
              </div>
          </div>
          ))}
        </div>
        
        {/* Flashcards and Youtube buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowFlashcards(true)}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            <Brain className="h-5 w-5" />
            Study Flashcards
          </button>
          <button
            onClick={() => setShowVideos(true)}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
          >
            <PlaySquare className="h-5 w-5" />
            Watch Videos
          </button>
        </div>
      </div>
  </div>
  );
}

export default QuizDetailspage;