import React, { useCallback, useEffect, useState } from 'react';
import { Library, Plus, Sidebar } from 'lucide-react';
import FlashcardDeck from './flashcarddeck';
import { useOutletContext } from 'react-router-dom';
import { getFlashcards } from '../../services/StudentService';


function FlashcardsSection({ limit }) {
   const [DECKS, setDECKS] = useState([]);
   const [loading, setloading] = useState(true);

   const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}
   const userId = user.uid
    const fetchflashcards = useCallback(async (retryCount = 3) => {
      try {
      setloading(true);
      const history = await getFlashcards(userId);
      setDECKS(history);
      } catch (error) {
      console.error("Error fetching Flashcards:", error);
      if (retryCount > 0) {
        console.log(`Retrying... ${retryCount} attempts left`);
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchflashcards(retryCount - 1);
      }
      } finally {
      setloading(false);
      }
    }, [userId]);

    useEffect(() => {
      fetchflashcards();
    }, [fetchflashcards]); 

  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
  const displayedDecks = limit ? DECKS.slice(0, limit) : DECKS
  return (
    <div className="space-y-6 mb-8 px-4 md:px-0">  
      <div className="flex flex-col md:flex-col md:items-start lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Library className="h-6 w-6 text-blue-500" />
            Flashcard Decks
          </h2>
          <p className="text-gray-600 mt-1">
            Review and manage your study Flashcards
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2 md:mr-0" />
          Create New Flashcards
        </button>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedDecks.map((deck,i) => (
          <FlashcardDeck
            key={i}
            deck={deck}
          />
        ))}
      </div>
    </div>
  );
}
export default FlashcardsSection