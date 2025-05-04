import React from 'react';
import { about } from '../constants';
import { Users, Users as TeamIcon, BookOpen, Crown } from 'lucide-react';

const icons = [BookOpen, TeamIcon, Crown, Users];

const Aboutpage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fadeIn">About Us</h1>
      <div className="space-y-8">
        {about.map((section, index) => {
          const Icon = icons[index % icons.length];
          return (
            <section
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex items-start space-x-4 animate-slideInUp"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards', opacity: 0 }}
            >
              <div className="text-indigo-600">
                <Icon size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                <p className="text-gray-700">{section.subtitle}</p>
              </div>
            </section>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Aboutpage;
