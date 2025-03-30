import React, { useState } from 'react';
import { Sidebar, Upload as UploadIcon } from 'lucide-react';
import UploadTabs from '../../components/dashboard/UploadTabs';
import FileUpload from '../../components/dashboard/FileUpload';
import TextUpload from '../../components/dashboard/TextUpload';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {uploadLesson} from '../../services/StudentService'
import toast from 'react-hot-toast';

export default function Upload({ onComplete }) {
  const [activeTab, setActiveTab] = useState('file');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate=useNavigate();
   const {toggleSidebar} = useOutletContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!file && activeTab === 'file') || (!text && activeTab === 'text') || (activeTab === 'file' && file.size > 10 * 1024 * 1024)) {
        toast.error('File must be less than 10MB.');
        return;
    }

    const data = activeTab === 'file' ? file : text
    console.log('Data:', data);
    setIsUploading(true);
    try {
      const response = await uploadLesson(data, title, activeTab);

      const LessonID=response.lesson_id;
      console.log('Lesson uploaded:', response);
      console.log('Lesson uploaded ID:', LessonID);
      setIsUploading(false);
      onComplete(LessonID);
      navigate('/Student/upload/quizsetup');
    }
    catch (error) {
      console.error('Error uploading lesson:', error);
      setIsUploading(false);
    }
    // Simulate upload delay
    // setTimeout(() => {
    //   setIsUploading(false);
    //   onComplete();
    // }, 2000);
    // navigate('/Dashboard/upload/QuizSetup');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className='flex items-start justify-center gap-4'>
          <button
            className="md:hidden text-gray-600 "
            onClick={() => {
            console.log("Toggle button clicked.");
            toggleSidebar();
            }}
          >
            <Sidebar className="h-8 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900  mb-2">Upload Learning Material</h1>
        </div>
        
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
