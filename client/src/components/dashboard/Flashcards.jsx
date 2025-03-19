import React, { useState } from 'react';
import { Layers, BookOpen, ArrowLeft } from 'lucide-react';

// Props {
//   keywords: string[];
//   onBack: () => void;
// }

export default function Flashcards({ keywords, onBack }) {
  // Mock flashcards based on keywords
  const flashcards = [
    { front: "What is the capital of France?", back: "Paris" },
    { front: "Which planet is known as the Red Planet?", back: "Mars" },
    { front: "What is the largest ocean on Earth?", back: "Pacific Ocean" },
    // Add more mock flashcards as needed
  ];

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Results
        </button>
        <div className="flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">Generated Flashcards</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Study Materials</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Based on keywords: {keywords.join(', ')}
          </p>
        </div>

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
            dark:from-blue-900/20 dark:to-blue-800/20
            ${isFlipped ? 'hidden' : 'block'}
            shadow-md
          `}>
            <p className="text-xl font-medium">{flashcards[currentCard].front}</p>
          </div>
          <div className={`
            absolute w-full h-full rounded-xl p-8
            flex items-center justify-center text-center
            bg-gradient-to-br from-green-50 to-green-100
            dark:from-green-900/20 dark:to-green-800/20
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
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentCard + 1} / {flashcards.length}
          </span>
          <button
            onClick={nextCard}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
          Study Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Review each card multiple times to reinforce learning</li>
          <li>• Try to recall the answer before flipping the card</li>
          <li>• Take breaks between study sessions for better retention</li>
          <li>• Create your own examples to strengthen understanding</li>
        </ul>
      </div>
    </div>
  );
}