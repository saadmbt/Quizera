import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getQuizResults } from '../../services/StudentService';


function QuizHistory(props) {
  
   const [quizHistory, setQuizHistory] = useState([]);
   const [loading, setloading] = useState(true);
   const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}

  // const { userId } = useContext(AuthContext);
   const userId = user.uid
    const fetchQuizHistory = useCallback(async (retryCount = 0) => {
      try {
      setloading(true);
      const history = await getQuizResults(userId);
      setQuizHistory(history);
      setloading(false);
      } catch (error) {
      console.error("Error fetching quiz history:", error);
      if (retryCount < 3) { // Retry up to 3 times
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => {
        fetchQuizHistory(retryCount + 1);
        }, 2000); // Wait 2 seconds before retrying
      } else {
        setloading(false);
        console.error("Failed to fetch quiz history after 3 attempts");
      }
      }
    }, [userId]);

    useEffect(() => {
      fetchQuizHistory();
      
      // Cleanup function
      return () => {
      setloading(false);
      };
    }, [fetchQuizHistory]); 


  const quizzes = props.limit ? quizHistory.slice(0, props.limit) : quizHistory

  return (
    <div className="space-y-4 mb-8 px-4 md:px-0">
      
      {quizzes.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-72  transition-all m-auto">
          <Award className="h-16 w-16 text-blue-500 mb-4 animate-pulse" />
          <p className="text-gray-700 text-xl font-semibold mb-2">No quizzes taken yet</p>
          <p className="text-gray-500 mb-4">Start your learning journey today!</p>
          <div className="flex gap-4">
            <Link
              to="/Student/upload"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="space-y-3">
                <div className="h-7 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                <div className="flex gap-4">
                  <div className="h-5 bg-gray-200 rounded-full animate-pulse w-24"></div>
                  <div className="h-5 bg-gray-200 rounded-full animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz list */}
      <div className="grid gap-4 md:grid-cols-2">
        {!loading && quizzes.sort((a, b) => new Date(b.date) - new Date(a.date)).map((quiz, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">{quiz.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {new Date(quiz.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  {quiz.timeSpent}s
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-purple-500" />
                  {quiz.score}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`
                  px-4 py-1.5 rounded-full text-sm font-medium
                  ${quiz.score >= 90 ? 'bg-green-100 text-green-800' :
                    quiz.score >= 70 ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'}
                `}>
                  {quiz.questions.length} Questions
                </div>
                <Link
                  to={`/Student/quizzes/${quiz._id}`}
                  className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View Details
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All link */}
      {props.showViewAll && quizzes.length > 0 && (
        <Link
          to="/Student/quizzes"
          className="flex items-center justify-center py-4 text-blue-600 hover:text-blue-800 font-medium group"
        >
          View All Quizzes
          <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default QuizHistory;