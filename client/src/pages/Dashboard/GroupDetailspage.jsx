import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Award, Brain, Users } from 'lucide-react';
import QuestionReview from '../../components/quiz/QuestionReview';
import { getGroupInfo, getQuizAssignments } from '../../services/StudentService';


function GroupDetailspage() {
    const [group, setGroup] = useState({});
    const [loading, setloading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [answers, setanswers] = useState([]);
    const [Assignments, setAssignments] = useState([]);
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
        setloading(true);
        const assignments = await getQuizAssignments(id);
        setAssignments(assignments);
      }catch (error) {
        console.error("Error fetching Group assignments:", error);
      } finally {
        setloading(false);
      }
    }, [id]);

    useEffect(() => {
        fetchGroup();
        fetchAssignments();
    }, []); 

    // filter assignments by quiz status 
    const completedAssignments = Assignments.filter((assignment) => assignment.isCompleted);
    const pendingAssignments = Assignments.filter((assignment) => !assignment.isCompleted);


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
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quizzes</h3>
                    {/* filter Assignments by status */}
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-500">Filter by:</span>
                        <button
                            onClick={()=>setAssignments(Assignments)}  
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            All
                        </button>
                        <button 
                            onClick={()=>setAssignments(completedAssignments)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                            Completed
                        </button>
                        <button 
                            onClick={()=>setAssignments(pendingAssignments)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                            Pending
                        </button>
                    </div>
                    <div className="space-y-4">
                        {Assignments.map((quiz,i) => (
                            <div key={i} 
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{quiz.title}</h4>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        quiz.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {quiz.isCompleted ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                                </div>

                                {/* Professor feedback */}
                                {quiz.isCompleted && quiz.feedback && (
                                    <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                                        <p className="font-medium"> Professor Feedback :</p>
                                        <p>{quiz.feedback}</p>
                                    </div>
                                )}

                                {/* action buttons  */}
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
                                        onClick={() => navigate(`/student/group/quiz/${quiz._id}`)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded mt-5 w-40">
                                            Take Quiz
                                        </button>
                                    )}
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetailspage;
