import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Calendar, Award, Brain, AlertCircle } from 'lucide-react';
import ScoreSummary from '../../components/dashboard/ScoreSummary';
import { getQuizAttemptsByQuizId, getQuizById } from '../../services/ProfServices';

function ProfQuizzdp() {
    const { id } = useParams();
    const [quizInfo, setQuizInfo] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                // Fetch quiz info from quizzes collection
                const quizInfoData = await getQuizById(id);
                setQuizInfo(quizInfoData);

                // Fetch quiz attempts for this specific quiz
                const attemptsData = await getQuizAttemptsByQuizId(id);
                if (attemptsData && attemptsData.length > 0) {
                    // Calculate quiz statistics from attempts
                    const totalScore = attemptsData.reduce((acc, attempt) => acc + attempt.totalScore, 0);
                    const averageScore = Math.round(totalScore / attemptsData.length);

                    // Create quiz object from attempts data
                    const quizData = {
                        _id: id,
                        title: quizInfoData.title || "Quiz Details",
                        date: attemptsData[0].submittedAt,
                        score: averageScore,
                        attempts: attemptsData,
                        questions: attemptsData[0].answers.map((ans, idx) => ({
                            id: idx + 1,
                            question: ans.question,
                            options: ans.options,
                            correctAnswer: ans.correctAnswer,
                            userAnswers: attemptsData.map(attempt => attempt.answers[idx]?.selectedAnswer)
                        }))
                    };
                    setQuiz(quizData);
                    setAttempts(attemptsData);
                } else {
                    setQuiz(null);
                    setAttempts([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                setError("Failed to load quiz data");
                setLoading(false);
            }
        };

        fetchQuizData();
    }, [id]);

    if (loading) {
        return <div className="max-w-4xl mx-auto p-6 text-center">Loading quiz data...</div>;
    }

    if (error || !quizInfo) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
                    <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist.</p>
                    <Link
                        to="/professor/quizzes"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Quizzes
                    </Link>
                </div>
            </div>
        );
    }

    const totalQuestions = quiz?.questions?.length || 0;
    const totalAttempts = attempts.length;

    return ( 
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    to="/professor/quizzes"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Quizzes
                </Link>
                <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">{quizInfo.title}</h1>
                </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(quizInfo.createdAt || quizInfo.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Total Attempts</p>
                            <p className="font-medium">{totalAttempts}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Average Score</p>
                            <p className="font-medium">{quiz?.score || 0}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Questions</p>
                            <p className="font-medium">{totalQuestions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Improved Quiz Overview */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-6 shadow-md border border-blue-300">
                <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-400 pb-2">Quiz Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-900">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium">Title</p>
                            <p className="text-lg font-bold">{quizInfo.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-lg">{new Date(quizInfo.createdAt || quizInfo.date).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium">Average Score</p>
                            <p className="text-lg font-semibold">{quiz?.score || 0}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Brain className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium">Total Attempts</p>
                            <p className="text-lg font-semibold">{totalAttempts}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium">Total Questions</p>
                            <p className="text-lg font-semibold">{totalQuestions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Summary */}
            {totalAttempts > 0 ? (
                <ScoreSummary 
                    quizLenght={totalQuestions * totalAttempts}
                    correctAnswers={attempts.reduce((acc, attempt) => 
                        acc + attempt.answers.filter(ans => ans.isCorrect).length, 0)}
                    incorrectAnswers={totalQuestions * totalAttempts - attempts.reduce((acc, attempt) => 
                        acc + attempt.answers.filter(ans => ans.isCorrect).length, 0)}
                />
            ) : (
                <p className="text-center text-gray-500">No attempts have been made for this quiz yet.</p>
            )}

            {/* Attempt Selector and Questions & Answers for Selected Attempt */}
            {totalAttempts > 0 && (
                <>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Select Student Attempt</h2>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            onChange={(e) => setSelectedAttemptIndex(Number(e.target.value))}
                            value={selectedAttemptIndex ?? ''}
                        >
                            <option value="" disabled>Select an attempt</option>
                            {attempts.map((attempt, index) => (
                                <option key={attempt._id} value={index}>
                                    {attempt.studentId} - {new Date(attempt.submittedAt).toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAttemptIndex !== null && attempts[selectedAttemptIndex] && quizInfo && quizInfo.questions && (
                        <div className="space-y-6 mt-6">
                            <h2 className="text-xl font-semibold">Questions & Answers - Student Attempt</h2>
                            {quizInfo.questions.map((question, index) => {
                                const answer = attempts[selectedAttemptIndex].answers.find(ans => ans.questionIndex === index + 1);
                                return (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium mb-4">
                                                    {index + 1}. {question.question}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {question.options.map((option, optionIndex) => {
                                                        const isCorrect = option === question.correctAnswer;
                                                        const isSelected = answer && option === answer.answerSubmitted;
                                                        return (
                                                            <div
                                                                key={optionIndex}
                                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                                    isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                                                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className={
                                                                        isCorrect ? 'text-green-700 font-semibold' : 'text-gray-700'
                                                                    }>
                                                                        {option}
                                                                    </span>
                                                                    {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {answer ? (answer.isCorrect ? 'Correct' : 'Incorrect') : 'No answer submitted'}
                                                </p>
                                                {answer && answer.feedback && (
                                                    <p className="mt-1 text-sm text-gray-500 italic">Feedback: {answer.feedback}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProfQuizzdp;
