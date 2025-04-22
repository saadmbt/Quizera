import React from 'react';
import { Play, ArrowLeft, Youtube } from 'lucide-react';
import VideoCard from './VideoCard';

export default function Videos({ videos=[], onBack }) {

     // If videos array is empty, show message
   if (!videos.length) {
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
          <h2 className="text-xl font-medium text-yellow-800 mb-2">No youtube videos Available</h2>
          <p className="text-yellow-700">
            It seems there are no youtube videos  generated yet. Try creating some new ones or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Results</span>
        </button>
        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
          <Youtube className="h-6 w-6 mr-2 text-red-600" />
          <span className="font-semibold text-lg text-gray-800">Recommended Videos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
            <VideoCard key={`video-${index}`} video={video} />
          ))
        }
      </div>
    </div>
  );
}
