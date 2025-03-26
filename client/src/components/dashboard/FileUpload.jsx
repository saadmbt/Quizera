import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, File as FileIcon, X as XIcon } from 'lucide-react';

export default function FileUpload({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
      handleFile(files[0]);
    }
  }, [onFileSelect]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-12
            flex flex-col items-center justify-center text-center
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Upload a file
            </button>
            {' or drag and drop'}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, PNG up to 10MB
          </p>
        </div>
      )}
  
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}  