import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
export default function LoadingComponent() {
  const [progress, setProgress] = useState(0);
  const [TimeEnd, setTimeEnd] = useState(false);
  // Simulate progress for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(()=>{
            setTimeEnd(true);
            toast.error('Time is up! Please try again.');
          },100)
          
          return 100;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => {
      clearInterval(interval)
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className=" rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Generating Quiz</h1>
          
          {/* Dot spinner animation */}
          <div className="flex space-x-3 mb-6">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
          </div>
          
          <p className="text-gray-600 text-center">Please wait while we generate the quiz for you.</p>
          
          {/* Simple progress indicator */}
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/*  */}
        {TimeEnd && (
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
          onClick={() => window.location.href = '/student/upload'}
          >
           try again
          </button>
        )}
      </div>
    </div>
  );
}