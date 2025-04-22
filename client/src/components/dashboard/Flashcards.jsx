import React, { useState } from 'react';
import { Layers, BookOpen, ArrowLeft } from 'lucide-react';

// Props {
//   onBack: () => function;
// }

export default function Flashcards({flashcards =[],onBack }) {

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

   // If flashcards array is empty, show message
   if (!flashcards.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Results
        </button>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-medium text-yellow-800 mb-2">No Flashcards Available</h2>
          <p className="text-yellow-700">
            It seems there are no flashcards generated yet. Try creating some new ones or check back later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900  "
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Results
        </button>
        <div className="flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">Generated Flashcards</span>
        </div>
      </div>

      <div className="bg-white  rounded-xl shadow-lg p-8 mb-8">
        {/* Flashcard */}
        <div
          className={`
            relative w-full aspect-[3/2] max-w-2xl mx-auto mb-8 cursor-pointer
            perspective-1000 transition-transform duration-500
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`
            absolute w-full h-full rounded-xl p-8
            flex items-center justify-center text-center
            bg-gradient-to-br from-blue-50 to-blue-100
            ${isFlipped ? 'hidden' : 'block'}
            shadow-md
          `}>
            <p className="text-xl font-medium">{flashcards[currentCard].front}</p>
          </div>
          <div className={`
            absolute w-full h-full rounded-xl p-8
            flex items-center justify-center text-center
            bg-gradient-to-br from-green-50 to-green-100
            ${isFlipped ? 'block' : 'hidden'}
            shadow-md
          `}>
            <p className="text-xl font-medium">{flashcards[currentCard].back}</p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={previousCard}
            className="px-4 py-2 rounded-lg bg-gray-100  hover:bg-gray-200 "
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 ">
            {currentCard + 1} / {flashcards.length}
          </span>
          <button
            onClick={nextCard}
            className="px-4 py-2 rounded-lg bg-gray-100  hover:bg-gray-200 "
          >
            Next
          </button>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 /20 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
          Study Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 ">
          <li>• Review each card multiple times to reinforce learning</li>
          <li>• Try to recall the answer before flipping the card</li>
          <li>• Take breaks between study sessions for better retention</li>
          <li>• Create your own examples to strengthen understanding</li>
        </ul>
      </div>
    </div>
  );
}