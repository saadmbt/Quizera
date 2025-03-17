import React from 'react'

function ScoreSummary({ quizLenght, correctAnswers, incorrectAnswers }) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
    <div className="bg-blue-50  rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-blue-600 ">{quizLenght}</p>
      <p className="text-sm text-blue-600 ">Total Questions</p>
    </div>
    <div className="bg-green-50  rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-green-600 ">{correctAnswers}</p>
      <p className="text-sm text-green-600 ">Correct Answers</p>
    </div>
    <div className="bg-red-50  rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-red-600 ">{incorrectAnswers}</p>
      <p className="text-sm text-red-600 ">Incorrect Answers</p>
    </div>
  </div>
  )
}

export default ScoreSummary