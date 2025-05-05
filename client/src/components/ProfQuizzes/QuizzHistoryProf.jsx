import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProfessorQuizzes, fetchQuizAttempts } from '../../services/ProfServices';

function QuizzHistoryProf({ limit }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Get all quizzes created by the professor
        const quizzesData = await fetchProfessorQuizzes();

        // Get all quiz attempts
        const attemptsData = await fetchQuizAttempts();

        // Map attempts to quizzes
        const quizzesWithAttempts = quizzesData.map(quiz => {
          const attempts = attemptsData.filter(attempt => attempt.quizId === quiz._id);
          return {
            ...quiz,
            attempts: attempts,
            averageScore: attempts.length > 0 
              ? attempts.reduce((acc, curr) => acc + curr.totalScore, 0) / attempts.length 
              : null
          };
        });

        setQuizzes(limit ? quizzesWithAttempts.slice(0, limit) : quizzesWithAttempts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [limit]);

  if (loading) {
    return <div className="text-center py-8">Loading quizzes...</div>;
  }

  return (
    <div className="space-y-4 mb-8 px-4 md:px-0">
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                {quiz.attempts?.length > 0 && (
                  <>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {quiz.attempts.length} attempts
                    </span>
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {Math.round(quiz.averageScore)}% avg
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`
                px-3 py-1 rounded-full text-sm
                ${quiz.attempts?.length 
                  ? quiz.averageScore >= 90 ? 'bg-green-100 text-green-800' 
                  : quiz.averageScore >= 70 ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'}
              `}>
                {quiz.questions?.length || 0} Questions
              </div>
              <Link
                to={`/professor/quizzes/${quiz._id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {limit && quizzes.length >= limit && (
        <Link
          to="/professor/quizzes"
          className="flex items-center justify-center py-3 text-blue-600 hover:text-blue-800"
        >
          View All Quizzes
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
}

export default QuizzHistoryProf;