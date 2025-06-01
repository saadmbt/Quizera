import React from 'react';

// Props {
//   question: str;
//   options: [str];
//   onAnswer: (answer: str) => function;
// }

export default function MultipleChoice({ question, options, onAnswer }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">{question}</h2>
      {options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        return (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="w-full text-left p-4 rounded-lg border-2 border-gray-200  hover:border-blue-500 transition-colors"
          >
            <span className="font-medium">{letter}.</span> {option}
          </button>
        );
      })}
    </div>
  );
}