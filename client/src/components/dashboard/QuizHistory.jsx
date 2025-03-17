import React from 'react';
import { Calendar, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUIZ_HISTORY = [
  {
    id: 1,
    title: 'Geography Quiz',
    date: '2024-03-15',
    score: 85,
    timeSpent: '12:30',
    questionsCount: 10,
    category: 'Geography'
  },
  {
    id: 2,
    title: 'World Capitals',
    date: '2024-03-14',
    score: 92,
    timeSpent: '15:45',
    questionsCount: 15,
    category: 'Geography'
  },
  {
    id: 3,
    title: 'Solar System Quiz',
    date: '2024-03-13',
    score: 78,
    timeSpent: '10:15',
    questionsCount: 8,
    category: 'Science'
  },
  {
    id: 4,
    title: 'Ancient History',
    date: '2024-03-12',
    score: 88,
    timeSpent: '20:00',
    questionsCount: 12,
    category: 'History'
  },
  {
    id: 5,
    title: 'Mathematics Basic',
    date: '2024-03-11',
    score: 95,
    timeSpent: '18:30',
    questionsCount: 10,
    category: 'Mathematics'
  }
];

function QuizHistory(props) {
  const quizzes = props.limit ? QUIZ_HISTORY.slice(0, props.limit) : QUIZ_HISTORY

  return (
    <div className="space-y-4 mb-8 px-4 md:px-0">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
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
                  {quiz.timeSpent}
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
                {quiz.questionsCount} Questions
              </div>
              <Link
                to={`/Dashboard/quizzes/${quiz.id}`}
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
          to="/Dashboard/quizzes"
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