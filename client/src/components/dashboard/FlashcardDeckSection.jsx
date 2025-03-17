import React from 'react';
import { Library, Plus } from 'lucide-react';
import FlashcardDeck from './flashcarddeck';

const DECKS = [
  {
    id: 1,
    title: 'Essential Spanish Phrases',
    description: 'Common expressions and vocabulary for daily conversations',
    cardCount: 50,
    category: 'Language',
    color: 'blue',
    progress: 75
  },
  {
    id: 2,
    title: 'World History: Ancient Civilizations',
    description: 'Key events and figures from ancient civilizations',
    cardCount: 30,
    category: 'History',
    color: 'purple',
    progress: 45
  },
  {
    id: 3,
    title: 'Calculus Fundamentals',
    description: 'Basic concepts and formulas in calculus',
    cardCount: 40,
    category: 'Mathematics',
    color: 'green',
    progress: 60
  },
  {
    id: 4,
    title: 'Physics: Quantum Mechanics',
    description: 'Introduction to quantum physics principles',
    cardCount: 25,
    category: 'Science',
    color: 'orange',
    progress: 30
  },
  {
    id: 5,
    title: 'Japanese Kanji',
    description: 'Essential kanji characters for beginners',
    cardCount: 100,
    category: 'Language',
    color: 'pink',
    progress: 20
  }
];

function FlashcardsSection({ limit }) {
  const displayedDecks = limit ? DECKS.slice(0, limit) : DECKS

  return (
    <div className="space-y-6 mb-8 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-col md:items-start lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6 text-blue-500" />
            Flashcard Decks
          </h2>
          <p className="text-gray-600 mt-1">
            Review and manage your study materials
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2 md:mr-0" />
          Create New Flashcards
        </button>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedDecks.map(deck => (
          <FlashcardDeck
            key={deck.id}
            {...deck}
          />
        ))}
      </div>
    </div>
  );
}
export default FlashcardsSection