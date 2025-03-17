import React from 'react';
import { FileText, Upload as UploadIcon } from 'lucide-react';

export default function UploadTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex rounded-lg bg-gray-100  p-1 mb-8">
      <button
        onClick={() => onTabChange('file')}
        className={`
          flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200
          ${activeTab === 'file'
            ? 'bg-white  text-blue-600  shadow-sm'
            : 'text-gray-600  hover:text-gray-900 '
          }
        `}
      >
        <UploadIcon className="h-4 w-4" />
        File
      </button>
      <button
        onClick={() => onTabChange('text')}
        className={`
          flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200
          ${activeTab === 'text'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        <FileText className="h-4 w-4" />
        Text
      </button>
    </div>
  );
}