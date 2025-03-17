import React from 'react';

export default function TextUpload({ value, onChange }) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or Paste your Lesson here."
        className="w-full h-64 p-4 rounded-lg border border-gray-300 
          bg-white  text-gray-900
          placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          resize-none"
      />
    </div>
  );
}