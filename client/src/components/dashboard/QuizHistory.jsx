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
      {loading ? (
          // Skeleton loading animation
          Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                      <div className="space-y-1 w-full">
                          {/* Title skeleton */}
                          <div className="h-7 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                          
                          {/* Date and time skeleton */}
                          <div className="flex items-center gap-6">
                              <div className="h-8 bg-gray-200 rounded-full animate-pulse w-32"></div>
                          </div>
                      </div>
                      {/* Status skeleton */}
                      <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24"></div>
                  </div>
              </div>
          ))
      
      ):quizzes.sort((a, b) => (b.score || 0) - (a.score || 0)).map((quiz,i) => (
        <div
          key={i}
          className="bg-white  rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between space-y-3">
            <div className="flex-1 ">
              <h3 className="font-semibold text-gray-900 ">{quiz.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 ">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(quiz.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {quiz.timeSpent} s
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {quiz.score}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`
                px-3 py-1 rounded-full text-sm
                ${quiz.score >= 90 ? 'bg-green-100 text-green-800  ' :
                  quiz.score >= 70 ? 'bg-blue-100 text-blue-800  ' :
                  'bg-orange-100 text-orange-800  '}
              `}>
                {quiz.questions.length} Questions
              </div>
              <Link
                to={`/Student/quizzes/${quiz._id}`}
                className="p-2 hover:bg-gray-100  rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {props.showViewAll && (
        <Link
          to="/Student/quizzes"
          className="flex items-center justify-center py-3 text-blue-600  hover:text-blue-800 -300"
        >
          View All Quizzes
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
}

export default QuizHistory;