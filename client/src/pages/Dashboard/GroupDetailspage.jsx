import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Award, Brain, Users } from 'lucide-react';
import QuestionReview from '../../components/quiz/QuestionReview';
import { getGroupInfo, getQuizAssignments } from '../../services/StudentService';


function GroupDetailspage() {
    const [group, setGroup] = useState({});
    const [loading, setloading] = useState(false);
    const [Assinloading, setAssinloading] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [answers, setanswers] = useState([]);
    const [Assignments, setAssignments] = useState([]);
    const [quizzes, setquizzes] = useState([]);
    const { id } = useParams();
    const navigate=useNavigate()

    // fetch group info
    const fetchGroup = useCallback(async () => {
      try{
        setloading(true);
        const info = await getGroupInfo(id);
        setGroup(info);
      }catch (error) {
        console.error("Error fetching Group info:", error);
      } finally {
        setloading(false);
      }

    }, [id]);

    // fecth group assignments
    const fetchAssignments = useCallback(async () => {
      try{
        setAssinloading(true);
        const assignments = await getQuizAssignments(id);
        setAssignments(assignments);
        setquizzes(assignments);
      }catch (error) {
        console.error("Error fetching Group assignments:", error);
      } finally {
        setAssinloading(false);
      }
    }, []);

    useEffect(() => {
        fetchGroup();
        fetchAssignments();
    }, []); 

    // Memoize filtered assignments to prevent unnecessary recalculations
    const filteredAssignments = React.useMemo(() => {
        return {
            all: [...Assignments],
            completed: Assignments.filter((assignment) => assignment.isCompleted),
            pending: Assignments.filter((assignment) => !assignment.isCompleted)
        };
    }, [Assignments]);


    if (showResults) {
        return <QuestionReview answers={answers} onBack={() => setShowResults(false)}  />;
    }
    if (loading) return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <Link
                    to="/Student/groups"
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="font-medium">Back to Groups</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Users className="h-7 w-7 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        {group?.title || 'Group Details'}
                    </h1>
                </div>
            </div>

            {/* Group Information Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                {/* group name and description */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-200 px-4 py-2 rounded-full">
                        {group?.title?.[0] || 'G'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{group?.group_name}</h2>
                        <p className="text-sm text-gray-500">{group?.description}</p>
                    </div>
                </div>
                {/* Group Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Creation Date</p>
                            {/* change date format */}
                            <p className="text-lg font-semibold text-gray-900">{new Date(group?.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <Users className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Members</p>
                            <p className="text-lg font-semibold text-gray-900">{group?.students?.length || 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <Award className="h-6 w-6 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Quizzes</p>
                            <p className="text-lg font-semibold text-gray-900">{Assignments.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Professor Details */}
                <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professor Details</h3>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-200 px-4 py-2 rounded-full">
                            {group?.profdetails?.name?.[0] || 'P'}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{group?.prof_name}</p>
                            <p className="text-sm text-gray-500">Professor</p>
                        </div>
                    </div>
                </div>

                {/* Quizzes Section */}
                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-800">Quizzes </h3>
                                        
                                        {/* Filter buttons with improved styling */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500 mr-2">Filter:</span>
                                            <div className="inline-flex rounded-md shadow-sm">
                                                <button
                                                    onClick={() => setquizzes(filteredAssignments.all)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border
                                                        ${Assignments === filteredAssignments.all 
                                                            ? 'bg-blue-500 text-white border-blue-500' 
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                    All ({filteredAssignments.all.length})
                                                </button>
                                                <button
                                                    onClick={() => setquizzes(filteredAssignments.completed)}
                                                    className={`px-4 py-2 text-sm font-medium border-t border-b
                                                        ${Assignments === filteredAssignments.completed 
                                                            ? 'bg-blue-500 text-white border-blue-500' 
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                    Completed ({filteredAssignments.completed.length})
                                                </button>
                                                <button
                                                    onClick={() => setquizzes(filteredAssignments.pending)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border
                                                        ${Assignments === filteredAssignments.pending 
                                                            ? 'bg-blue-500 text-white border-blue-500' 
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                    Pending ({filteredAssignments.pending.length})
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* reload button */}
                                <div className="mb-4 flex justify-end">
                                    <button 
                                        onClick={fetchAssignments}
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                </div>
                                
                    {/* Quiz List */}
                    <div className="space-y-4">
                        {Assinloading ? (
                            // Skeleton loading animation
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 w-full">
                                            {/* Title skeleton */}
                                            <div className="h-7 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                                            
                                            {/* Date and time skeleton */}
                                            <div className="flex items-center gap-6">
                                                <div className="h-8 bg-gray-200 rounded-full animate-pulse w-32"></div>
                                                <div className="h-8 bg-gray-200 rounded-full animate-pulse w-32"></div>
                                            </div>
                                        </div>
                                        {/* Status skeleton */}
                                        <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24"></div>
                                    </div>
                                </div>
                            ))
                        ) : quizzes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                                <Brain className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">No quizzes available yet</p>
                                <p className="text-gray-400 text-sm">Check back later for new assignments</p>
                            </div>
                        ) : (
                            quizzes.map((quiz, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 transform hover:-translate-y-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <h4 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                                {quiz.title}
                                            </h4>
                                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                                <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                    {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                                    {quiz.duration || 'No time limit'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2
                                            ${quiz.isCompleted 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${quiz.isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                            {quiz.isCompleted ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                    {/* {quiz.isCompleted && quiz.feedback && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                                                <Award className="w-5 h-5" />
                                                Professor Feedback
                                            </p>
                                            <p className="text-blue-700 text-sm leading-relaxed">{quiz.feedback}</p>
                                        </div>
                                    )} */}

                                    {/* action buttons will be handled  */}
                                <div>
                                    {quiz.isCompleted ? (
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 py-1 px-3 rounded mt-5 w-40"
                                        onClick={() => {
                                            setanswers(quiz.answers)
                                            setShowResults(true)
                                        }} 
                                        >
                                            View Results
                                        </button>
                                    ) : (
                                        <button 
                                        onClick={() => navigate(`/Student/groups/quiz/${quiz._id}`)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded mt-5 w-40">
                                            Take Quiz
                                        </button>
                                    )}
                                </div>
                                
                            </div>
                        )))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetailspage;
