import { useState } from 'react';
import { BookOpen, MessageSquare, FileText, UserPlus, Award } from 'lucide-react';

export default function StartComponent() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completionStep, setCompletionStep] = useState(2);
  const totalSteps = 4;

  const handleCardClick = (cardId) => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const QuickStartCard = ({ id, icon, title, description }) => {
    const Icon = icon;
    return (
      <div 
        className={`relative bg-white rounded-lg p-4 cursor-pointer transition-all duration-300 border border-gray-200 ${
          hoveredCard === id ? 'shadow-lg transform -translate-y-1' : ''
        }`}
        onMouseEnter={() => setHoveredCard(id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick(id)}
      >
        <div className="flex flex-col gap-3">
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        {isLoading && hoveredCard === id && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section - Quick start */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quick start</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickStartCard 
              id="generate"
              icon={BookOpen}
              title="Generate"
              description="Transform anything into flashcards, quizzes and youtube videos."
            />
            
            <QuickStartCard 
              id="chat"
              icon={MessageSquare}
              title="PDF to Flashcards & Quizzes"
              description="Upload your document and  generate from it."
            />
            
            <QuickStartCard 
              id="assign"
              icon={FileText}
              title="Assign"
              description="Learn how to use assignments ."
            />
          </div>

          {/* Premium section */}
          <div className=" bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-2">
                <h3 className="text-xl font-bold">Generate More with</h3>
                <h3 className="text-xl font-bold text-yellow-400">Premium</h3>
              </div>
              
              <p className="text-sm mb-6 ">
                Upgrade for more powerful AI, unlimited questions, and support for longer documents. Supercharge your learning experience today!
              </p>
              
              <button 
                className="bg-yellow-400 text-gray-800 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                onMouseEnter={() => setHoveredCard('upgrade')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <span className="text-lg">⚡</span> Upgrade
              </button>
            </div>
            
            {/* Illustration */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-end justify-end">
              <div className="relative">
                <div className="absolute top-10 right-10 bg-green-200 rounded-lg p-2 transform rotate-6 animate-pulse">
                    <span className="text-lg">📚</span>
                </div>
                <div className="absolute -top-12 -left-16 bg-blue-300 rounded-lg p-2 transform -rotate-6">
                  <span className="text-lg">🖼️</span>
                </div>
                
                <div className="absolute top-0 right-0 bg-white rounded-lg p-1 transform rotate-6 animate-pulse">
                  <span className="text-lg">💬</span>
                </div>
                
                <div className="absolute top-4 right-4 bg-blue-200 rounded-lg p-1 transform rotate-12">
                    <span className="text-lg">📈</span>
                </div>
              </div>
            </div>
            
            {/* AI funnel */}
            <div className="absolute top-10 right-20">
              <div className="w-16 h-16 bg-yellow-400 transform rotate-12 rounded-lg flex items-center justify-center">
                <span className="text-lg">AI</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right section - Profile completion */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Complete your profile</h2>
            
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm text-gray-600">Add your school and subjects to get custom recommendations</p>
              
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
                  style={{ 
                    transform: `rotate(${(completionStep / totalSteps) * 360}deg)`,
                    transition: 'transform 1s ease-in-out' 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">{completionStep}/{totalSteps}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-3">
            <div className="mt-1">
              <Award className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">School Access</h3>
              <p className="text-sm text-gray-600">Unlock premium features for all your teachers and students.</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-3">
            <div className="mt-1">
              <UserPlus className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Invite your friends</h3>
              <p className="text-sm text-gray-600">Learning together is double the progress and double the fun!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}