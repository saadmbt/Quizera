import React from 'react';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const LessonCard = ({ title, subject }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BookOpenIcon className="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{subject}</p>
          </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default LessonCard;