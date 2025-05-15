import React, { useState, useEffect } from 'react';
import { fetchProfessorGroups, assignQuizToGroups } from '../../services/ProfServices.jsx';
import { generateQuiz } from '../../services/StudentService.jsx';
import { ChevronRight, Brain, Target, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QUESTION_TYPES = [
  { id: 'multiple-choice', label: 'Multiple Choice', icon: Brain },
  { id: 'true-false', label: 'True/False', icon: Target },
  { id: 'fill-blank', label: 'Fill in the Blank', icon: HelpCircle }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

export default function QuizSetup({ onStartQuiz, lessonID }) {
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState(null);
  const [questionType, setQuestionType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [quizStartTime, setQuizStartTime] = useState(''); 
  // Removed timeLimit state as per rollback
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfessor = location.pathname.includes('professor');

  useEffect(() => {
    if (isProfessor) {
      const fetchGroups = async () => {
        setGroupsLoading(true);
        setGroupsError(null);
        try {
          const storedUser = JSON.parse(localStorage.getItem('_us_unr')) || null;
          const fetchedGroups = await fetchProfessorGroups(storedUser);
          setGroups(fetchedGroups);
        } catch (error) {
          setGroupsError('Failed to load groups');
        } finally {
          setGroupsLoading(false);
        }
      };
      fetchGroups();
    }
  }, [isProfessor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const quizSetupData = {
      lesson_id: lessonID,
      type: questionType,
      number: questionCount,
      difficulty,
    };
    console.log(quizSetupData)

    try {
      if (isProfessor) {
        // Validate quiz start time and due date before generating quiz
        if (selectedGroups.length === 0) {
          toast.error('No group selected for quiz assignment');
          setIsLoading(false);
          return;
        }
        if (!quizStartTime) {
          toast.error('Quiz start time is required');
          setIsLoading(false);
          return;
        }
        const dueDateISO = dueDate ? new Date(dueDate).toISOString() : null;
        const startTimeISO = quizStartTime ? new Date(quizStartTime).toISOString() : null;
        const nowISO = new Date().toISOString();
        if (startTimeISO < nowISO) {
          toast.error('Quiz start time cannot be in the past');
          setIsLoading(false);
          return;
        }
        if (dueDateISO && startTimeISO > dueDateISO) {
          toast.error('Due date must be after the start time');
          setIsLoading(false);
          return;
        }

        // Generate the quiz first
        const quizResponse = await generateQuiz(quizSetupData);
        if (!quizResponse || !quizResponse.quiz) {
          toast.error('Quiz generation failed');
          setIsLoading(false);
          return;
        }

        const quizId = quizResponse.quiz._id || quizResponse.quiz.id || quizResponse.quiz;

        const storedUser = JSON.parse(localStorage.getItem('_us_unr')) || null;
        const assignedBy = storedUser ? storedUser.uid : 'current_professor_uid';
        const assignedAt = new Date().toISOString();
        const groupIds = selectedGroups;

        console.log('Start time before sending:', startTimeISO); // Debug log

        await assignQuizToGroups({
          quizId,
          groupIds,
          assignedBy,
          assignedAt,
          dueDate: dueDateISO,
          startTime: startTimeISO // Make sure startTime is included
        });

        // Refactor quiz object to send to QuizPreview
        const refinedQuiz = {
          title: quizResponse.quiz.title || "Untitled Quiz",
          questions: quizResponse.quiz.questions || [],
          settings: {
            dueDate: dueDateISO,
            startTime: startTimeISO,
            difficulty: quizSetupData.difficulty,
            type: quizSetupData.type 
          }
        };
        navigate('/professor/upload/quizpreview', { state: { quiz: refinedQuiz, quizId: quizId } });
      } else {
        onStartQuiz(quizSetupData);
        navigate('/student/quiz');
      }
    } catch (error) {
      console.error('Error during quiz creation and assignment:', error);
      toast.error('Error during quiz creation and assignment: ' + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const progress = [
    !!questionType,
    !!difficulty,
    isProfessor ? selectedGroups.length > 0 : false,
    isProfessor ? !!quizStartTime : false, // Include start time in progress for professor
  ].filter(Boolean).length + (isProfessor ? 1 : 1);

  const totalSteps = isProfessor ? 4 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          {isProfessor ? 'Create Quiz' : 'Start Your Quiz'}
        </motion.h1>
        <p className="text-gray-600 text-lg">
          {isProfessor
            ? 'Design a quiz and share it with your students'
            : 'Customize your quiz experience'}
        </p>

        {/* Progress bar */}
        <div className="mt-6 relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-sm text-gray-600">
              {progress} of {totalSteps} steps completed
            </div>
          </div>
          <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress / totalSteps) * 100}%` }}
              className="bg-blue-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Type Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Select Question Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUESTION_TYPES.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setQuestionType(id)}
                  className={
                    "p-6 rounded-lg border-2 transition-all " +
                    (questionType === id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-300")
                  }
                >
                  <Icon className={"h-10 w-10 mb-3 mx-auto " + (questionType === id ? "text-blue-500" : "text-gray-400")} />
                  <div className="text-base font-medium text-center">{label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Select Difficulty Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DIFFICULTY_LEVELS.map(({ id, label }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setDifficulty(id)}
                  className={
                    "py-3 px-6 rounded-lg text-base font-medium transition-all " +
                    (difficulty === id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100")
                  }
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              Number of Questions: {questionCount}
            </label>
            <div className="px-2">
              <input
                type="range"
                min="5"
                max="20"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Quiz Start Time Input */}
          {isProfessor && (
            <>
              <div className="space-y-4">
                <label htmlFor="quizStartTime" className="block text-lg font-medium text-gray-900">
                  Quiz Start Time
                </label>
                <input
                  id="quizStartTime"
                  type="datetime-local"
                  value={quizStartTime}
                  onChange={(e) => setQuizStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="dueDate" className="block text-lg font-medium text-gray-900">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
            </>
          )}
          {/* Removed Time Limit Input as per rollback */}

          {/* Group Selection (only for professors) */}
          {isProfessor && (
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Share with Group
              </label>
              {groupsLoading && <p>Loading groups...</p>}
              {groupsError && <p className="text-red-500">{groupsError}</p>}
              {!groupsLoading && !groupsError && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groups.map(({ _id, group_name }) => {
                    const isSelected = selectedGroups.includes(_id);
                    return (
                      <motion.button
                        key={_id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGroups(selectedGroups.filter(id => id !== _id));
                          } else {
                            setSelectedGroups([...selectedGroups, _id]);
                          }
                        }}
                        className={
                          "p-4 rounded-lg border-2 transition-all text-left " +
                          (isSelected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300")
                        }
                      >
                        <div className="text-base font-medium">{group_name}</div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!questionType || !difficulty || (isProfessor && (selectedGroups.length === 0 || !quizStartTime)) || isLoading}
            className={
              "w-full flex items-center justify-center py-4 px-6 rounded-lg text-base font-medium transition-all " +
              (!questionType || !difficulty || (isProfessor && (selectedGroups.length === 0 || !quizStartTime)) || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg")
            }
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <>
                {isProfessor ? 'Create & Share Quiz' : 'Start Quiz'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
