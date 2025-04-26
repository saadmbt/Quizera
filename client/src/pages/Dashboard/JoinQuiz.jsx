// interface for join quiz by link  '...../quiz/:Quiz_id'
// first check if the user is logged in or not 
// then check if the Quiz_id is valid or not before joining the quiz by getting the quiz by id
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/authnavbarlogo.png';
import { AuthContext } from '../../components/Auth/AuthContext';
import Popup from '../../components/quiz/Popup';

const JoinQuiz = () => {
    const { Quiz_id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setshow] = useState(true);

    const { user, isAuthenticated } = useContext(AuthContext); 
    console.log("User:", user); // Log the user state
    console.log("Is Authenticated:", isAuthenticated);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`https://prepgenius-backend.vercel.app/api/quizzes/${Quiz_id}`);
                setQuiz(response.data);
                setLoading(false);
            } catch (err) {
                setError('Quiz not found or you are not authorized');
                setLoading(false);
            }
        };
        checkAuth();
    }, [Quiz_id, navigate]);
    useEffect(() => {
        if (!user || !user.uid) {
            setshow(false)
        }
    }, [isAuthenticated, navigate, Quiz_id]); // Check if the user is authenticated

    const handleJoinQuiz = () => {
        navigate(`/student/quiz/${Quiz_id}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto px-4 mt-8">
            <div className="flex justify-center items-center mt-8 ">
                <a href="/" className="cursor-pointer">
                        <img src={logo} alt="Logo" className="w-48 h-13" loading='lazy'/>
                </a>
            </div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        </div>
    );

    return (
        <div>
            {/* Header Logo */}
            <div className="flex justify-center items-center mt-8 ">
                <a href="/" className="cursor-pointer">
                    <img src={logo} alt="Logo" className="w-48 h-13" loading='lazy'/>
                </a>
            </div>
        
        <div className="max-w-4xl min-h-3.5 mx-auto px-4 py-8">
            {/* Quiz Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-8 text-white">
                <h1 className="text-2xl font-bold mb-2">{quiz?.title}</h1>
                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:space-x-3 text-blue-100">
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                        </svg>
                        <span className="font-semibold pr-2">Created by: </span> {quiz.generated_by}
                    </span>
                   
                    <span> <span className='pr-3'>•</span><span className="font-semibold pr-2">Created on: </span> { new Date(quiz?.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            {/* Quiz Details Section */}
            <div className="bg-white rounded-b-2xl shadow-xl p-8 border border-gray-100">
                {/* Quiz Statistics */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:space-x-4">
                        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            <span className='font-semibold'>Quiz Type:</span> <span className=' text-medium'>{quiz?.type}</span> 
                        </div>
                        <div className="text-gray-600">
                            <span className="font-semibold text-medium">Duration:</span> {quiz?.duration || 'No time limit '} minutes
                        </div>
                        <div className="text-gray-600">
                            <span className="font-semibold text-medium ">Total Questions:</span> {quiz?.questions?.length || 0}
                        </div>
                    </div>
                    
                    {/* Warning Message */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-yellow-700">
                                Make sure you have a stable internet connection before starting the quiz.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Start Quiz Section */}
                <div className="flex flex-col gap-3 items-start  md:flex-row md:items-center justify-between border-t pt-6">
                    <div className="text-gray-600">
                        <p className="font-medium text-lg">Ready to begin?</p>
                        <p className="text-sm">Take your time and read each question carefully. Good luck!</p>
                    </div>
                    {show ? 
                    ( <button 
                        onClick={handleJoinQuiz}
                        className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-medium flex items-center shadow-lg"
                    >
                        Start Quiz
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button> )
                    :<Popup Quiz_id={Quiz_id}/>}
                </div>
            </div>
        </div></div>
    );
};

export default JoinQuiz;
