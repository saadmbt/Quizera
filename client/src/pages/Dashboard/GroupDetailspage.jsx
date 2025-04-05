import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Award, Brain, Users } from 'lucide-react';
import QuestionReview from '../../components/quiz/QuestionReview';
const  groups=[
    {
        id: 1,
        title: "Group 1",
        description: "This is group 1",
        createdOn: "2025-03-05",
        profdetails: {
            name: "John Doe",
            designation: "Professor",
            },
        members: 5,
        quizzes: [
            {
                id: 1,
                title: "Quiz 1",
                description: "This is quiz 1",
                createdOn: "2025-03-05",
                completed: true,
            },
            {
                id: 2,
                title: "Quiz 2",
                description: "This is quiz 2",
                createdOn: "2025-03-05",
                completed: true,
            },
            {
                id: 3,
                title: "Quiz 3",
                description: "This is quiz 3",
                createdOn: "2025-03-05",
                completed: false,
            },

        ],
    },
]

function GroupDetailspage() {
    const { id } = useParams();
    const group = groups.find(g => g.id === parseInt(id));
    const [showResults, setShowResults] = useState(false);
    if (showResults) {
        return <QuestionReview onBack={() => setShowResults(false)} />;
    }
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
                {/* Group Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Creation Date</p>
                            <p className="text-lg font-semibold text-gray-900">{group?.createdOn}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <Users className="h-6 w-6 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Members</p>
                            <p className="text-lg font-semibold text-gray-900">{group?.members}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <Award className="h-6 w-6 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Quizzes</p>
                            <p className="text-lg font-semibold text-gray-900">{group?.quizzes?.length || 0}</p>
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
                            <p className="font-semibold text-gray-900">{group?.profdetails?.name}</p>
                            <p className="text-sm text-gray-500">{group?.profdetails?.designation}</p>
                        </div>
                    </div>
                </div>

                {/* Quizzes Section */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quizzes</h3>
                    <div className="space-y-4">
                        {group?.quizzes?.map(quiz => (
                            <div key={quiz.id} 
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{quiz.title}</h4>
                                        <p className="mt-1 text-gray-600">{quiz.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        quiz.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {quiz.completed ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Created on: {quiz.createdOn}
                                </div>
                                {/* action buttons  */}
                                <div>
                                    {quiz.completed ? (
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 py-1 px-3 rounded mt-5 w-40"
                                        onClick={() => setShowResults(true)} 
                                        >
                                            View Results
                                        </button>
                                    ) : (
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded mt-5 w-40">
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
