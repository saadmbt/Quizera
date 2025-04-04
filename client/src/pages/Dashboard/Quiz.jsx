import React, { useState, useEffect } from 'react';
import MultipleChoice from '../../components/quiz/MultipleChoice';
import FillInBlank from '../../components/quiz/FillInBlank';
import QuizProgress from '../../components/quiz/QuizProgress';
import QuizComplete from '../../components/quiz/QuizComplete';
import Videos from '../../components/dashboard/Videos';
import { generateQuiz } from '../../services/StudentService';
import Flashcards from '../../components/dashboard/Flashcards';
import QuestionReview from '../../components/quiz/QuestionReview';


// interface Question {
//   id: number;
//   type: 'multiple-choice' | 'true-false' | 'fill-blank';
//   question: string;
//   options?: [string];
//   correctAnswer: string;
//   blanks?: [string];
//   answers?: [string];
// }

// interface Answer {
//   questionId: number;
//   selectedAnswer: string;
//   isCorrect: boolean;
//   time: number;
// }

// Mock questions for demonstration
const MOCK_QUESTIONS= [
  {
    id: 1,
    type: 'multiple-choice',
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    type: 'true-false',
    question: "The Earth is flat.",
    options: ["True", "False"],
    correctAnswer: "False"
  },
  {
    id: 3,
    type: 'fill-blank',
    question: "Complete the sentence: The Sun is a ___ and Earth is a ___.",
    blanks: ["star", "planet"],
    answers: ["star", "planet"],
    correctAnswer: "star,planet"
  }
];

export default function Quiz({ settings , LessonID}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showQuestions, setshowQuestions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  
  const score = answers.filter(answer => answer.isCorrect).length;
  const keywords = ['geography', 'capitals', 'planets', 'oceans'];
  // use effect to generate the Quiz by calling the generateQuiz function from the StudentService
  // useEffect(() => {
  //   const getQuiz = async () => {
  //     try {
  //       const quiz = await generateQuiz(LessonID, settings.type, settings.questionCount, settings.difficulty);
  //       console.log('Quiz:', quiz);
  //       setIsLoading(true);
  //       // setQuiz(quiz);
  //       } catch (error) {
  //         setError(error);
  //       }finally{
  //         setIsLoading(false);
  //       }
  //     };
  //     getQuiz();
  // }
  // , [LessonID, settings]);

  // use effect to start the timer
  useEffect(() => {
    let interval;
    try {
      interval = setInterval(() => {
        if (!quizComplete) {
          setTimer(prev => prev + 1);
        }
      }, 1000);
    } catch (err) {
      setError('Timer initialization failed');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quizComplete]);

  // use effect to set the start time
  useEffect(() => {
    try {
      setStartTime(Date.now());
    } catch (err) {
      setError('Failed to start timer');
    }
  }, [currentQuestion]);

  const handleAnswer = (selectedAnswer) => {
    try {
      const question = MOCK_QUESTIONS[currentQuestion];
      const isCorrect = selectedAnswer === question.correctAnswer;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      setAnswers(prev => [...prev, {
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        time: timeSpent
      }]);

      if (currentQuestion < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setQuizComplete(true);
      }
    } catch (err) {
      setError('Failed to process answer');
      setTimeout(() => setError(null), 3000);
    }
  };
  // add a dev that tell the user if the quiz is gennrating 
  // if (isLoading) {
  //   return (
  //     <div className="max-w-2xl mx-auto p-6">
  //       <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Quiz</h1>
  //         <p className="text-gray-600">Please wait while we generate the quiz for you.</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (showFlashcards) {
    return <Flashcards onBack={() => setShowFlashcards(false)} />;
  }

  if (showVideos) {
    return <Videos keywords={keywords} onBack={() => setShowVideos(false)} />;
  }
  if (showQuestions) {
    return <QuestionReview  onBack={() => setshowQuestions(false)} />;
  }

  if (quizComplete) {
    return (
      <QuizComplete
        score={score}
        totalQuestions={MOCK_QUESTIONS.length}
        answers={answers}
        onShowFlashcards={() => setShowFlashcards(true)}
        onShowVideos={() => setShowVideos(true)}
        onshowQuestions={() => setshowQuestions(true)}
      />
    );
  }

  const question = MOCK_QUESTIONS[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={MOCK_QUESTIONS.length}
        timer={timer}
      />

      <div className="bg-white  rounded-lg shadow-lg p-6 mb-8">
        {question.type === 'fill-blank' ? (
          <FillInBlank
            question={question.question}
            answers={question.answers || []}
            blanks={question.blanks || []}
            onAnswer={handleAnswer}
          />
        ) : (
          <MultipleChoice
            question={question.question}
            options={question.options || []}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}