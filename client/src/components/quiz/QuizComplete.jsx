import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart, Brain, ChevronRight , Share2, Youtube } from 'lucide-react';
import ScoreSummary from '../dashboard/ScoreSummary';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {saveQuizAttempt, saveQuizResult} from '../../services/StudentService';

//  Props {
//   score: number;
//   totalQuestions: number;
//   answers: Array;
//   onShowFlashcards: () => function;
//   onShowVideos: () => function;
// }

export default function QuizComplete({ quizResult , score , totalQuestions , onShowFlashcards
    , onShowVideos , onshowQuestions , getquiz_resualt_id , fromGroup }) {

  const [quiz_res_id,setquiz_res_id]=useState(null)
  const user= JSON.parse(localStorage.getItem('_us_unr'))
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const isLowScore = scorePercentage < 70;
  const incorrectanswers =totalQuestions - score;
  const navigate = useNavigate();
  // add a varible in localstorage to check if the quiz result is saved  or not
  const isResultSavedIn = JSON.parse(localStorage.getItem('isResultSaved')) || false;
  console.log("isResultSavedIn",isResultSavedIn)
    useEffect(() => {
      if (isLowScore && quiz_res_id) {        
        console.log('Recommendations for improvement shown');
        // Show recommendations for improvement
        getquiz_resualt_id(quiz_res_id)
        
      }
      }, [quiz_res_id]);

    useEffect(() => {
      if (!isResultSavedIn && quizResult && !fromGroup) {
        saveQuizResult(quizResult)
          .then((response) => {
            setquiz_res_id(response.quiz_result_id);
            localStorage.setItem('isResultSaved',true)
            console.log('Quiz result saved successfully');
          })
          .catch((error) => {
            console.error('Error saving quiz result:', error);
          });
      } else if (!isResultSavedIn && quizResult && fromGroup) {
        const  quizAtteemptRes={
          quizId:quizResult.quiz_id,
          username:user.username,
          submittedAt: quizResult.date,
          answers: quizResult.questions,
          totalScore: scorePercentage,
          feedback:"No Feedback Provided yet",
        }
        saveQuizAttempt(quizAtteemptRes)
          .then((res) => {
            localStorage.setItem('isResultSaved',true)
            toast.success(" Your Quiz attempt saved successfully");
            console.log("ress ",res)
          })
          .catch((error) => {
            console.error('Error saving quiz result:', error);
          });
      }
    }, [isResultSavedIn, quizResult]); 

    // Function to handle sharing the quiz link
    const onShareQuiz = () => {
      const quizLink = `http://localhost:5173/JoinQuiz/${quizResult.quiz_id}`;
      
      // Copy the quiz link to clipboard
    navigator.clipboard.writeText(quizLink)
      .then(() => {
        toast.success('Quiz link copied to clipboard');
      })
      .catch(err => {
        toast.error('Failed to copy quiz link');
        console.error('Failed to copy quiz link: ', err);
      });
    }
    
  return (
  <div className="max-w-2xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>
      
      {/* Score Display */}
      <div className="text-center">
        <div className={`text-5xl font-bold mb-2 ${scorePercentage >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
        {scorePercentage}%
        </div>
        <div className="text-gray-600 mb-4">
        {score} out of {totalQuestions} correct
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${scorePercentage >= 70 ? 'bg-green-500' : 'bg-orange-500'} transition-all duration-500 ease-out`}
          style={{ width: `${(score / totalQuestions) * 100}%` }}
        />
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2 justify-between">
          <div className='flex items-center gap-2'>
            <BarChart className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Performance Breakdown</h3>
          </div>
          {/* share quiz button to copy quiz link */}
         {!fromGroup && (
           <button className="btn btn-primary py-1 hover:transition-all duration-300 transform hover:scale-105 " onClick={onShareQuiz}>
           <Share2 className="h-5 w-5 text-white mr-2 " />
           Share Quiz
         </button>)}
        </div>
        <ScoreSummary quizLenght={totalQuestions} correctAnswers={score} incorrectAnswers={incorrectanswers} />

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div className="text-sm text-gray-600">Average Time per Question</div>
        <div className="text-2xl font-semibold text-blue-600">
          {(quizResult.timeSpent / quizResult.questions.length)} seconds
        </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-lg">Questions Review</h3>
        <div className="flex items-center space-x-2 cursor-pointer hover:transition-all duration-300 transform hover:scale-105" 
        onClick={onshowQuestions}
        >
          <span className="text-medium text-blue-600">
            {quizResult.questions.length} questions 
          </span>
          <ChevronRight className="h-5 w-5 text-blue-600" />
        </div>
      </div>
  
      {/* Recommendations for low scores */}
      {isLowScore && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Recommendations for Improvement</h3>
            <ul className="text-sm space-y-3 text-blue-700">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Review the material with our generated flashcards
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Watch recommended video explanations
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Focus on topics where you scored lowest
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Practice with similar questions to build confidence
            </li>
            </ul>
          </div>

          {!fromGroup &&( <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onShowFlashcards}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                <Brain className="h-5 w-5" />
                Study Flashcards
              </button>
              <button
                onClick={onShowVideos}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              >
                <Youtube className="h-5 w-5" />
                Watch Videos
              </button>
            </div>)}
        </div>
      )}
       <div>
          <button
          onClick={()=>{
            localStorage.setItem('isResultSaved',false)
            fromGroup ? navigate('/Student/groups'):navigate('/Student')
          }}
          className="flex items-center w-full justify-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-500 text-gray-500 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
      </div>

      </div>
    </div>
    );
}