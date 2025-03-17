import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

// Mock flashcard data
const FLASHCARD_DECKS = {
  1: {
    id: 1,
    title: 'Essential Spanish Phrases',
    cards: [
      { id: 1, front: '¡Hola!', back: 'Hello!' },
      { id: 2, front: '¿Cómo estás?', back: 'How are you?' },
      { id: 3, front: 'Gracias', back: 'Thank you' },
      { id: 4, front: 'Por favor', back: 'Please' },
      { id: 5, front: 'De nada', back: 'You\'re welcome' }
    ]
  },
  2: {
    id: 2,
    title: 'World History: Ancient Civilizations',
    cards: [
      { id: 1, front: 'Who built the pyramids?', back: 'Ancient Egyptians' },
      { id: 2, front: 'What was the capital of the Roman Empire?', back: 'Rome' },
      { id: 3, front: 'Who was the first Emperor of China?', back: 'Qin Shi Huang' }
    ]
  }
};

export default function FlashcardStudy() {
  const { id } = useParams();
  const deck = FLASHCARD_DECKS[Number(id)];
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!deck) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deck Not Found</h2>
          <Link
            to="/Dashboard/flashcards"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % deck.cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + deck.cards.length) % deck.cards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col items-start md:flex-col md:items-start lg:flex-row lg:items-start justify-between mb-8">
        <Link
          to="/Dashboard/flashcards"
          className="flex mb-3 items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Flashcards
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
        <div className="w-24" />
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentCard + 1} of {deck.cards.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentCard + 1) / deck.cards.length) * 100}%` }}
          />
        </div>
        <p className="text-lg text-gray-600 mt-4 font-bold">Tap the card to discover the answer</p>
      </div>

      {/* Flashcard */}
      <div 
        className="relative w-full aspect-[3/2] max-w-2xl mx-auto mb-8 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div className={`
          absolute inset-0 rounded-xl p-8
          transform transition-all duration-500
          ${isFlipped ? 'rotate-y-180' : ''}
          preserve-3d
        `}>
          {/* Front */}
          <div className={`
            absolute inset-0 rounded-xl p-8
            flex items-center justify-center text-center
            bg-yellow-100
            ${isFlipped ? 'hidden' : 'block'}
            backface -hidden
          `}>
            <p className="text-2xl font-medium">{deck.cards[currentCard].front}</p>
          </div>

          {/* Back */}
          <div className={`
            absolute inset-0 rounded-xl p-8
            flex items-center justify-center text-center
            bg-green-200
            ${isFlipped ? 'block' : 'hidden'}
            backface-hidden rotate-y-180
          `}>
            <p className="text-2xl font-medium">{deck.cards[currentCard].back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleFlip}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <RotateCw className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}