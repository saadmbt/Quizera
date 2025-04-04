import React from 'react';
import { Play, ArrowLeft, Youtube } from 'lucide-react';

// VideosProps {
//   keywords: string[];
//   onBack: () => function;
// }

// Video {
//   id: string;
//   title: string;
//   thumbnail: string;
//   duration: string;
//   views: string;
// }

export default function Videos({onBack }) {
  // Mock video data based on keywords
  const videos = [
    {
      id: '1',
      title: 'Understanding Basic Geography: World Capitals',
      thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80',
      duration: '10:25',
      views: '125K'
    },
    {
      id: '2',
      title: 'The Solar System: Mars and Beyond',
      thumbnail: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1600&q=80',
      duration: '15:30',
      views: '89K'
    },
    {
      id: '3',
      title: 'Earth\'s Oceans: A Complete Guide',
      thumbnail: 'https://images.unsplash.com/photo-1497290756760-23ac55edf36f?auto=format&fit=crop&w=1600&q=80',
      duration: '12:45',
      views: '203K'
    },
  ];

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
          <Youtube className="h-5 w-5 mr-2 text-red-500" />
          <span className="font-medium">Recommended Videos</span>
        </div>
      </div>

      <div className="bg-white  rounded-xl shadow-lg p-8">
        <div className="grid gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col md:flex-row gap-4 bg-gray-50  rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative md:w-64 h-48 ">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 hover:cursor-pointer bg-black/50 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                <div className="flex items-center text-sm text-gray-600 ">
                  <span className="flex items-center">
                    <Play className="h-4 w-4 mr-1" />
                    {video.views} views
                  </span>
                </div>
                <button className="mt-4 inline-flex items-center text-sm text-blue-600  hover:text-blue-800 ">
                  Watch Now
                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}