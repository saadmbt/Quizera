import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar, Award, Brain, AlertCircle } from 'lucide-react';
import ScoreSummary from '../../components/dashboard/ScoreSummary';
import { getQuizAttemptsByQuizId } from '../../services/ProfServices';

function ProfQuizzdp() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                // Fetch quiz attempts for this specific quiz
                const attemptsData = await getQuizAttemptsByQuizId(id);
                
                if (attemptsData && attemptsData.length > 0) {
                    // Calculate quiz statistics from attempts
                    const totalScore = attemptsData.reduce((acc, attempt) => acc + attempt.totalScore, 0);
                    const averageScore = Math.round(totalScore / attemptsData.length);
                    const correctAnswers = attemptsData.reduce((acc, attempt) => {
                        return acc + attempt.answers.filter(ans => ans.isCorrect).length;
                    }, 0);
                    
                    // Create quiz object from attempts data
                    const quizData = {
                        _id: id,
                        title: "Quiz Details",
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

    if (error || !quiz) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
                    <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has no attempts.</p>
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

    const totalQuestions = quiz.questions.length;
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
                    <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(quiz.date).toLocaleDateString()}</p>
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
                            <p className="font-medium">{quiz.score}%</p>
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

            {/* Score Summary */}
            <ScoreSummary 
                quizLenght={totalQuestions * totalAttempts}
                correctAnswers={attempts.reduce((acc, attempt) => 
                    acc + attempt.answers.filter(ans => ans.isCorrect).length, 0)}
                incorrectAnswers={totalQuestions * totalAttempts - attempts.reduce((acc, attempt) => 
                    acc + attempt.answers.filter(ans => ans.isCorrect).length, 0)}
            />

            {/* Questions & Answers */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Questions & Answers</h2>
                {quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium mb-4">
                                    {index + 1}. {question.question}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question.options.map((option, optionIndex) => {
                                        const timesChosen = question.userAnswers.filter(ans => ans === option).length;
                                        const percentage = Math.round((timesChosen / totalAttempts) * 100);
                                        
                                        return (
                                            <div
                                                key={optionIndex}
                                                className={`
                                                    p-4 rounded-lg border-2 transition-all
                                                    ${option === question.correctAnswer
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={
                                                        option === question.correctAnswer
                                                            ? 'text-green-700'
                                                            : 'text-gray-700'
                                                    }>
                                                        {option}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-500">
                                                            {percentage}% ({timesChosen})
                                                        </span>
                                                        {option === question.correctAnswer && 
                                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                                        }
                                                    </div>
                                                </div>
                                                {/* Progress bar showing selection percentage */}
                                                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${
                                                            option === question.correctAnswer
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-300'
                                                        }`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfQuizzdp;