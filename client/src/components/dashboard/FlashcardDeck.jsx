import React from 'react';
import { Book, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FlashcardDeck({ id, title, description, cardCount }) {
    const navigate = useNavigate();
    const handleStudy = () => {
        navigate(`/Student/flashcards/study/${id}`);
    };

    return (
        <div className="relative overflow-hidden rounded-xl border bg-white transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:transform hover:-translate-y-1">
            <div className="flex flex-col h-full p-6">
                {/* Title and Description */}
                <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{description}</p>

                    {/* Stats */}
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                        <Book className="w-4 h-4 mr-1" />
                        <span>{cardCount} cards</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleStudy}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        Study
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlashcardDeck;