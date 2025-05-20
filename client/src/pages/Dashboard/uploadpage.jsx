import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import UploadTabs from '../../components/dashboard/UploadTabs';
import FileUpload from '../../components/dashboard/FileUpload';
import TextUpload from '../../components/dashboard/TextUpload';
import { useNavigate } from 'react-router-dom';
import {uploadLesson} from '../../services/StudentService'
import toast from 'react-hot-toast';

export default function Upload({ onComplete }) {
  const [activeTab, setActiveTab] = useState('file');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const user =JSON.parse(localStorage.getItem('_us_unr')) || {}
  const navigate=useNavigate();
  localStorage.setItem('isResultSaved',false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if  (activeTab === 'file' && file && file.size > 10 * 1024 * 1024) {
        toast.error('File must be less than 10MB.');
        return;
    }
    if  (activeTab === 'text' && text.length > 10000) {
        toast.error('Text must be less than 10000 characters.');
        return;
    }
    if(!file && activeTab === 'file'){
      toast('Please select a file to upload.',{
        icon: '❗',
        style: {
          size: '1rem',
          fontSize: '1rem', 
        },
      });
      return;
    }
    const data = activeTab === 'file' ? (file ? file : null) : (text.trim() ? text : null);
    // Log or handle data appropriately in production 
    // logService.log('Data to be uploaded:', data);

    setIsUploading(true);
    try {
      if ((activeTab === 'file' && !file) || (activeTab === 'text' && !text.trim())) {
        toast('Please select a file or enter valid text to upload.',{
          icon: '❗❗',
          style: {
            size: '1rem',
            fontSize: '1rem', 
          },
        });
        setIsUploading(false);
        return;
      }
      const response = await uploadLesson(data, title, activeTab,user.username);

      const LessonID = response && response.lesson_id ? response.lesson_id : null;
      if (!LessonID) {
        toast.error('Failed to retrieve Lesson ID. Please try again.');
        setIsUploading(false);
        return;
      }
      // Log the response in production using a proper logging mechanism if needed
      // Example: logService.log('Lesson uploaded:', response);
      console.log('Lesson uploaded ID:', LessonID);
      setIsUploading(false);
      onComplete(LessonID);
      navigate('/Student/upload/quizsetup');
    }
    catch (error) {
      console.error('Error uploading lesson:', error);
      setIsUploading(false);
    }

  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className='flex items-start justify-center gap-4'>
          <h1 className="text-2xl font-bold text-gray-900  mb-2">Upload Learning Material</h1>
        </div>
        <p className="text-gray-600 text-center ">Add new content to your learning library</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <UploadTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'file' ? (
          <FileUpload onFileSelect={setFile } setTitle={setTitle}/>
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
