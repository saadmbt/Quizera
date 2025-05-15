import { BrainCircuit, Users, Calendar } from 'lucide-react';
import React, { useContext } from 'react'
import { AuthContext } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function GroupCard({ group }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleredirect = () => {
        navigate(`/Student/groups/${group.id}`);
    }
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm transition-all duration-300 border border-gray-100">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base md:text-lg text-gray-800 hover:text-blue-600 transition-colors">
                {group.name}
              </h3>
              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3">
                <div className="flex items-center text-gray-600">
                  <BrainCircuit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="text-xs md:text-sm font-medium">{group.quizzes.length || 0} Quizzes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="text-xs md:text-sm font-medium">{group.members || 0} Members</span>
                </div>
              </div>
            </div>
            
            {/* Group Status Badge */}
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
              Active
            </span>
          </div>
          {/* Description */}
          <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 flex-grow">
            {group.description || 'No description provided'}
          </p>
  
          {/* Footer */}
          <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                onClick={handleredirect}
              >
                View Group
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default GroupCard;
