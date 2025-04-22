import { ArrowLeft, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import React, { useState } from 'react'

function QuestionReview({answers,onBack}) {
    const [showAll, setShowAll] = useState(false);
    const [expandedExplanations, setExpandedExplanations] = useState([]);

  const toggleExplanation = (index) => {
    setExpandedExplanations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
                <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 "
                >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Results
                </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg">Questions Review</h3>
                <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                    {answers.length} questions ({answers.filter(a => a.isCorrect).length} correct)
                </span>
                </div>
            </div>
            
            <div className="divide-y divide-gray-100">
                {answers.slice(0, showAll ? answers.length : 5).map((answer, index) => (
                <div key={index} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{answer.question}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        answer.isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">                    
                    <div className="flex items-start space-x-2">
                        <div className={` h-4 w-4 flex-shrink-0 rounded-full ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                        <p className="text-gray-700">
                            <span className="font-medium">Your answer: </span> 
                            {answer.userAnswer}
                        </p>
                        {!answer.isCorrect && answer.correctAnswer && (
                            <p className="text-gray-700 mt-1">
                            <span className="font-medium">Correct answer: </span>
                            {answer.correctAnswer}
                            </p>
                        )}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-gray-500">
                        <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{answer.time}s</span>
                        </div>
                        
                        {answer.explanation && (
                        <button 
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            onClick={() => toggleExplanation(index)}
                        >
                            {expandedExplanations.includes(index) ? (
                            <>Hide explanation <ChevronUp className="h-4 w-4 ml-1" /></>
                            ) : (
                            <>View explanation <ChevronDown className="h-4 w-4 ml-1" /></>
                            )}
                        </button>
                        )}
                    </div>
                    
                    {answer.explanation && expandedExplanations.includes(index) && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md text-gray-700">
                        {answer.explanation}
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </div>
            
            {answers.length > 5 && (
                <div className="text-center py-4 border-t border-gray-100">
                <button 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                    <>See all {answers.length} questions <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                </button>
                </div>
            )}
            </div>
    </div>
  )
}

export default QuestionReview