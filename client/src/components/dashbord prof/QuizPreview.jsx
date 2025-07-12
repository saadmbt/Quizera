import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Settings, Check, X, Edit2, Save, XCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { updateQuizQuestions } from '../../services/ProfServices.jsx';
import toast from 'react-hot-toast';
import { generateFlashcards, fetchVideos } from '../../services/StudentService.jsx';
import { useCallback } from 'react';
import { exportQuizToPDF } from './QuizPreviewPDFExport.jsx';

export default function QuizPreview() {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [localQuizData, setLocalQuizData] = useState(null);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz;
  const quizIdFromState = location.state?.quizId;
  const lessonIDFromState = location.state?.lessonID;
  console.log(quizIdFromState)

  // Initialize localQuizData state with quiz from location state
  useEffect(() => {
    if (quiz) {
      setLocalQuizData(quiz);
    }
  }, [quiz]);

  // Use localQuizData if available, else fallback to default
  const quizData = localQuizData || quiz || {
    title: "No quiz data available",
    questions: [],
    settings: {}
  };

  // Provide defaults for settings fields to avoid undefined errors
  const timeLimit = quizData.settings?.timeLimit || "N/A";
  const difficulty = quizData.settings?.difficulty || "N/A";
  const type = quizData.settings?.type || "N/A";

  // Initialize editedQuestions when entering edit mode
  const startEditing = () => {
    setEditedQuestions(JSON.parse(JSON.stringify(quizData.questions)));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedQuestions([]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...editedQuestions];
    updated[index].question = value;
    setEditedQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...editedQuestions];
    const isFillBlank = Array.isArray(updated[qIndex].answers);
    if (isFillBlank) {
      updated[qIndex].answers[aIndex] = value;
    } else {
      updated[qIndex].options[aIndex] = value;
    }
    setEditedQuestions(updated);
  };

  const handleAddAnswer = (qIndex) => {
    const updated = [...editedQuestions];
    const isFillBlank = Array.isArray(updated[qIndex].answers);
    if (isFillBlank) {
      updated[qIndex].answers.push("");
    } else {
      updated[qIndex].options.push("");
    }
    setEditedQuestions(updated);
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updated = [...editedQuestions];
    const isFillBlank = Array.isArray(updated[qIndex].answers);
    if (isFillBlank) {
      updated[qIndex].answers.splice(aIndex, 1);
    } else {
      updated[qIndex].options.splice(aIndex, 1);
    }
    setEditedQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...editedQuestions];
    updated[qIndex].correctanswer = value;
    setEditedQuestions(updated);
  };

  const saveChanges = async () => {
    try {
      // Validate editedQuestions before sending
      for (const q of editedQuestions) {
        if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
          toast.error('Each question must have a non-empty question text.');
          return;
        }
        const isFillBlank = Array.isArray(q.answers);
        if (isFillBlank) {
          if (!Array.isArray(q.answers) || q.answers.length === 0) {
            toast.error('Each fill-blank question must have at least one answer.');
            return;
          }
          if (!q.correctanswer || !q.answers.includes(q.correctanswer)) {
            toast.error('Each fill-blank question must have a correct answer that is in the answers list.');
            return;
          }
        } else {
          if (!Array.isArray(q.options) || q.options.length === 0) {
            toast.error('Each question must have at least one option.');
            return;
          }
          if (!q.correctanswer || !q.options.includes(q.correctanswer)) {
            toast.error('Each question must have a correct answer that is in the options list.');
            return;
          }
        }
      }
      const quizIdToUse = quizData._id || quizIdFromState;
      await updateQuizQuestions(quizIdToUse, editedQuestions);
      toast.success('Questions updated successfully');
      setIsEditing(false);
      // Update local quiz data to reflect changes
      setLocalQuizData({
        ...quizData,
        questions: editedQuestions
      });
    } catch (error) {
      toast.error('Failed to update questions: ' + (error.message || 'Unknown error'));
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://quizera-beige.vercel.app/quiz/${quizData._id || 123}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareQuiz = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  // Add handlers for generating flashcards and fetching videos
  const handleGenerateFlashcards = useCallback(async () => {
    if (!localQuizData) {
      toast.error("Quiz data not loaded");
      return;
    }
    const lesson_id = lessonIDFromState;
    const quiz_result_id = quizIdFromState || (localQuizData && localQuizData._id);
    if (!lesson_id || !quiz_result_id) {
      toast.error("Missing lesson_id or quiz_result_id in quiz data");
      return;
    }
    try {
      setFlashcardsLoading(true);
      await generateFlashcards(lesson_id, quiz_result_id,true);
      toast.success("Flashcards generated successfully");
    } catch (error) {
      toast.error("Failed to generate flashcards: " + (error.message || error));
    } finally {
      setFlashcardsLoading(false);
    }
  }, [localQuizData, lessonIDFromState, quizIdFromState]);

  const handleFetchVideos = useCallback(async () => {
    if (!localQuizData) {
      toast.error("Quiz data not loaded");
      return;
    }
    const lesson_id = lessonIDFromState;
    const quiz_result_id = quizIdFromState || (localQuizData && localQuizData._id);
    if (!lesson_id || !quiz_result_id) {
      toast.error("Missing lesson_id or quiz_result_id in quiz data");
      return;
    }
    try {
      setVideosLoading(true);
      await fetchVideos(lesson_id, quiz_result_id,true);
      toast.success("YouTube videos fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch videos: " + (error.message || error));
    } finally {
      setVideosLoading(false);
    }
  }, [localQuizData, lessonIDFromState, quizIdFromState]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/professor/upload"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Upload
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Preview</h1>
        <div className="w-20"></div>
      </div>

      {/* Quiz Info Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{quizData.title}</h2>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
              title="Edit Questions"
            >
              <Edit2 className="mr-1 h-4 w-4" /> Edit
            </button>
          ) : (
            <div>
              <button
                onClick={saveChanges}
                className="flex items-center px-3 py-1 border rounded text-green-600 hover:bg-green-50 mr-2"
                title="Save Changes"
              >
                <Save className="mr-1 h-4 w-4" /> Save
              </button>
              <button
                onClick={cancelEditing}
                className="flex items-center px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                title="Cancel"
              >
                <XCircle className="mr-1 h-4 w-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Quiz Settings */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">
              {quizData.settings?.dueDate && !isNaN(new Date(quizData.settings.dueDate).getTime())
                ? new Date(quizData.settings.dueDate).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                : "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="font-medium">{difficulty}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{type}</p>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Questions ({quizData.questions.length})</h3>
          {(!isEditing ? quizData.questions : editedQuestions).map((q, idx) => {
            // Determine type per question
            const isFillBlank = Array.isArray(q.answers);
            const answersOrOptions = isFillBlank ? q.answers : q.options;
            return (
              <div key={idx} className="border rounded-lg p-4">
                {!isEditing ? (
                  <>
                    <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(answersOrOptions || []).map((item, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded border ${
                            item === q.correctanswer
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-500 bg-gray-100'
                          }`}
                        >
                          {item}
                          {item === q.correctanswer && (
                            <Check className="h-4 w-4 text-green-500 inline ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block font-medium mb-1">Question {idx + 1}</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2 mb-2"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(idx, e.target.value)}
                    />
                    <label className="block font-medium mb-1">
                      {isFillBlank ? "Answers" : "Options"}
                    </label>
                    {(answersOrOptions || []).map((item, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <input
                          type="text"
                          className="flex-grow border rounded p-2"
                          value={item}
                          onChange={(e) => handleAnswerChange(idx, i, e.target.value)}
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveAnswer(idx, i)}
                          title="Remove"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mb-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleAddAnswer(idx)}
                    >
                      Add {isFillBlank ? "Answer" : "Option"}
                    </button>
                    <label className="block font-medium mb-1">Correct Answer</label>
                    <select
                      className="w-full border rounded p-2"
                      value={q.correctanswer}
                      onChange={(e) => handleCorrectAnswerChange(idx, e.target.value)}
                    >
                      {(answersOrOptions || []).map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* New buttons for flashcards and videos */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleGenerateFlashcards}
            disabled={flashcardsLoading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {flashcardsLoading ? "Generating Flashcards..." : "Generate Flashcards"}
          </button>
          <button
            onClick={handleFetchVideos}
            disabled={videosLoading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {videosLoading ? "Generating Videos..." : "Generate YouTube Videos"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/professor/quizzes')}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          View All Quizzes
        </button>
        <button
          onClick={() => navigate('/professor/upload')}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Another Quiz
        </button>
        <button
          onClick={() => exportQuizToPDF(quizData)}
          className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 ml-4"
          title="Export Quiz to PDF"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}
