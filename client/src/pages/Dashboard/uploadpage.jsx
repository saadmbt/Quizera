import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import UploadTabs from '../../components/dashboard/UploadTabs';
import FileUpload from '../../components/dashboard/FileUpload';
import TextUpload from '../../components/dashboard/TextUpload';

export default function Upload({ onComplete }) {
  const [activeTab, setActiveTab] = useState('file');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!file && activeTab === 'file') || (!text && activeTab === 'text')) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900  mb-2">Upload Learning Material</h1>
        <p className="text-gray-600 ">Add new content to your learning library</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <UploadTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'file' ? (
          <FileUpload onFileSelect={setFile} />
        ) : (
          <TextUpload value={text} onChange={setText} />
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700  mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your Lesson Title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white  text-gray-900 
                placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || (!file && !text) || !title}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
            text-white font-medium transition-colors duration-200
            ${isUploading || (!file && !text) || !title
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Uploading...
            </>
          ) : (
            <>
              <UploadIcon className="h-5 w-5" />
              Upload Material
            </>
          )}
        </button>
      </form>
    </div>
  );
}