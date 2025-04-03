import React, { useState } from 'react';
import { GripHorizontal } from 'lucide-react';

// Props {
//   question: str;
//   answers: [str];
//   blanks: [str];
//   onAnswer: (answer: str) => function;
// }

export default function FillInBlank({ question, answers, blanks, onAnswer }) {
  console.log(question);
  console.log(answers);
  console.log(blanks);
  const [draggedItem, setDraggedItem] = useState(null);
  const [filledBlanks, setFilledBlanks] = useState(new Array(blanks.length).fill(''));

  const handleDragStart = (e, answer) => {
    setDraggedItem(answer);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-100', 'dark:bg-blue-900/20');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900/20');
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900/20');
    
    if (draggedItem) {
      const newFilledBlanks = [...filledBlanks];
      newFilledBlanks[index] = draggedItem;
      setFilledBlanks(newFilledBlanks);

      if (newFilledBlanks.every(blank => blank !== '')) {
        onAnswer(newFilledBlanks.join(','));
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {answers.map((answer, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, answer)}
            onDragEnd={handleDragEnd}
            className="p-4 bg-blue-50  rounded-lg cursor-move flex items-center justify-between"
          >
            <span>{answer}</span>
            <GripHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        {blanks.map((_, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className="p-4 border-2 border-dashed border-gray-300  rounded-lg min-h-[3rem] flex items-center justify-center"
          >
            {filledBlanks[index] || 'Drop answer here'}
          </div>
        ))}
      </div>
    </div>
  );
}