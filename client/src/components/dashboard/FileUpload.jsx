import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon } from 'lucide-react';


export default function FileUpload({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-12
        flex flex-col items-center justify-center text-center
        transition-colors duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50 '
          : 'border-gray-300 '
        }
      `}
    >
      <UploadIcon className="h-12 w-12 text-gray-400  mb-4" />
      <div className="text-sm text-gray-600 ">
        <button className="text-blue-600  hover:text-blue-700 font-medium">
          Upload a file
        </button>
        {' or drag and drop'}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx"
        />
      </div>
      <p className="text-xs text-gray-500  mt-2">
        PDF, DOC up to 10MB
      </p>
    </div>
  );
}