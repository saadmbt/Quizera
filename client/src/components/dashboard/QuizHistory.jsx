import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getQuizResults } from '../../services/StudentService';


function QuizHistory(props) {
  
   const [quizHistory, setQuizHistory] = useState([]);
   const [loading, setloading] = useState(false);

  // const { userId } = useContext(AuthContext);
   const userId = "saad"; // Replace with actual user ID from context or props
    const fetchQuizHistory = useCallback(async () => {
      try{
        setloading(true);
        const history = await getQuizResults(userId);
        setQuizHistory(history);
      }catch (error) {
        console.error("Error fetching quiz history:", error);
      } finally {
        setloading(false);
      }

    }, [userId]);

    useEffect(() => {
      fetchQuizHistory();
    }, []); 

  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
  const quizzes = props.limit ? quizHistory.slice(0, props.limit) : quizHistory

  return (
    <div className="space-y-4 mb-8 px-4 md:px-0">
      {quizzes.map((quiz,i) => (
        <div
          key={i}
          className="bg-white  rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
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