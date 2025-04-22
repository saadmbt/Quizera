import React, { useState, useEffect } from 'react';
import MultipleChoice from '../../components/quiz/MultipleChoice';
import FillInBlank from '../../components/quiz/FillInBlank';
import QuizProgress from '../../components/quiz/QuizProgress';
import QuizComplete from '../../components/quiz/QuizComplete';
import Videos from '../../components/dashboard/Videos';
import { generateQuiz } from '../../services/StudentService';
import Flashcards from '../../components/dashboard/Flashcards';
import QuestionReview from '../../components/quiz/QuestionReview';
import LoadingComponent from '../../components/dashboard/LoadingComponent';

// {'id': 21, 'title': 'sujets Securité 5', 'generated_by': 'get_jwt_identity()', 'type': 'multiple-choice', 'questions': [{'question': "Quel est le type d'attaque qui consiste à injecter du code JavaScript malveillant dans une page web pour voler des informations de connexion d'un utilisateur ?", 'options': ['Cookie poisoning', 'Session hijacking', 'Cross Site Scripting (XSS)', 'Directory Transversal'], 'correctanswer': 'Cross Site Scripting (XSS)'}, {'question': "Quel est le type d'attaque qui consiste à utiliser des informations de configuration par défaut d'un système pour accéder à des parties protégées du système ?", 'options': ['DDOS', 'Fishing', 'Default Password', 'Firewall'], 'correctanswer': 'Default Password'}, {'question': 'Quel est le type de protection qui consiste à encrypter les données pour les rendre illisibles pour les tiers non autorisés ?', 'options': ['Antivirus', 'Firewall', 'Cryptage', 'Private Key'], 'correctanswer': 'Cryptage'}, {'question': "Quel est le type d'attaque qui consiste à envoyer un grand nombre de requêtes à un serveur pour le rendre indisponible ?", 'options': ['Fishing', 'Session hijacking', 'DDOS', 'Cookie poisoning'], 'correctanswer': 'DDOS'}, {'question': 'Quel est le type de mécanisme de sécurité qui consiste à utiliser des clés publiques et privées pour authentifier les utilisateurs ?', 'options': ['Private Key', 'Public Key', 'Firewall', 'Antivirus'], 'correctanswer': 'Private Key'}], 'createdAt': datetime.datetime(2025, 4, 15, 14, 13, 23, 540496), '_id': ObjectId('67fe69838a05e334f1a88bac')}"
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

export default function Quiz({ settings={lesson_id:"68011808688b19fef9bf2d5a",type: "fill-blank",} }) {
  const [quiz, setQuiz] = useState({
    "_id": "68015950a66f3594b6488a84",
    "createdAt": "Thu, 17 Apr 2025 19:41:04 GMT",
    "generated_by": "get_jwt_identity()",
    "id": 61,
    "questions": [
      {
        "answers": [
          "definition",
          "creation",
          "querying",
          "storage"
        ],
        "blanks": [
          "___"
        ],
        "correctanswer": "querying",
        "explanation": "SQL is used to query and manipulate data stored in a database.",
        "question": "SQL is a language used for __________ of data stored in a database."
      },
      {
        "answers": [
          "insert",
          "update",
          "delete",
          "retrieve"
        ],
        "blanks": [
          "___"
        ],
        "correctanswer": "retrieve",
        "explanation": "A SELECT statement is used to retrieve data from a database.",
        "question": "A SELECT statement in SQL is used to __________ data from a database."
      },
      {
        "answers": [
          "increase",
          "decrease",
          "limit",
          "filter"
        ],
        "blanks": [
          "___"
        ],
        "correctanswer": "limit",
        "explanation": "The LIMIT and OFFSET clauses are used to limit the number of rows returned in a query.",
        "question": "The LIMIT and OFFSET clauses in SQL are used to __________ the number of rows returned in a query."
      },
      {
        "answers": [
          "group",
          "sort",
          "filter",
          "calculate"
        ],
        "blanks": [
          "___"
        ],
        "correctanswer": "filter",
        "explanation": "The HAVING clause is used to filter the results of an aggregate function.",
        "question": "The HAVING clause in SQL is used to __________ the results of an aggregate function."
      },
      {
        "answers": [
          "unique",
          "primary",
          "foreign",
          "common"
        ],
        "blanks": [
          "___"
        ],
        "correctanswer": "foreign",
        "explanation": "A JOIN is used to combine rows from two or more tables based on a foreign key column.",
        "question": "A JOIN in SQL is used to combine rows from two or more tables based on a __________ column."
      }
    ],
    "title": "coursMySQL-DIL",
    "type": "fill-blank"
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showQuestions, setshowQuestions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [QuizResult,setQuizResult]=useState({})
  const [score, setScore] = useState(0);

  const keywords = settings.keywords || ['geography', 'capitals', 'planets', 'oceans'];

  // generate the Quiz by calling the generateQuiz function from the StudentService
  // useEffect(() => {
  //   const getQuiz = async () => {
  //     try {
  //       setIsLoading(true);
  //       const quiz = await generateQuiz(settings);
  //       console.log('Quiz:', quiz.quiz);
  //       setQuiz(quiz.quiz);
  //       } catch (error) {
  //         setError(error);
  //       }finally{
  //         setIsLoading(false);
  //       }
  //     };
  //     getQuiz();
  // }
  // , [settings]);

  // use effect to start the timer
  useEffect(() => {
    let interval;
    try {
      interval = setInterval(() => {
        if (quizComplete) {
          clearInterval(interval);
        } else {
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
  // Remove direct state update in render to prevent infinite re-renders
  // Instead, use useEffect to update QuizResult when quiz or timer changes
  useEffect(() => {
    if (quiz) {
      setQuizResult({
        title: quiz.title,
        date: quiz.createdAt,
        score: quiz.score,
        timeSpent: timer,
        type: quiz.type,
        questions: []
      });
    }
  }, []);
  const handleAnswer = (selectedAnswer) => {
    
    try {
      const question = quiz.questions[currentQuestion];
      const AnswerByType = quiz.type === 'fill-blank' && question.blanks && question.blanks.length - 1 > 1 ?
       selectedAnswer.split(',') : selectedAnswer;
      console.log("ansew",AnswerByType)
      const isCorrect = AnswerByType === question.correctanswer; 
      console.log("iscorrect",isCorrect)
      // Check if the answer is correct
      if (isCorrect) {
        setScore(prev => prev + 1);
      } 
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      const questionRes = {
        id: question.id,
        question: question.question,
        options: quiz.type === 'fill-blank' ? question?.answers : question?.options,
        correctAnswer: question.correctanswer,
        userAnswer:selectedAnswer,
        isCorrect,
        time: timeSpent,
        explanation: question.explanation,
      }

      setQuizResult({...QuizResult, questions:[...QuizResult.questions, questionRes]})

      if (currentQuestion < quiz.questions.length-1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setQuizComplete(true);
      }
    } catch (err) {
      console.error('Error in handleAnswer:', err);
      setError('Failed to process answer');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (isLoading || !quiz || !quiz.questions) {
    return <LoadingComponent />;
  }

  if (showFlashcards) {
    return <Flashcards onBack={() => setShowFlashcards(false)} />;
  }

  if (showVideos) {
    return <Videos keywords={keywords} onBack={() => setShowVideos(false)} />;
  }
  if (showQuestions && QuizResult.questions) {
    return <QuestionReview answers={QuizResult.questions} onBack={() => setshowQuestions(false)} />;
  }

  if (quizComplete) {
    return (
      <QuizComplete
        quizResult={QuizResult}
        score={score}
        totalQuestions={quiz && quiz.questions ? quiz.questions.length : 0}
        answers={answers}
        onShowFlashcards={() => setShowFlashcards(true)}
        onShowVideos={() => setShowVideos(true)}
        onshowQuestions={() => setshowQuestions(true)}
      />
    );
  }

  const question = quiz && quiz.questions ? quiz.questions[currentQuestion] : null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {error && (
        <div className="error-message-container fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={quiz?.questions ? quiz.questions.length : 0}
        timer={timer}
      />

      <div className="bg-white  rounded-lg shadow-lg p-6 mb-8">
        {quiz.type === 'fill-blank' ? (
          question ? (
            <FillInBlank
              question={question.question || []}
              answers={question.answers || []}
              blanks={question.blanks || []}
              onAnswer={handleAnswer}
            />
          ) : null
        ): ( question ? (
            <MultipleChoice
              question={question.question || []}
              options={question.options || []}
              onAnswer={handleAnswer}
            />
          ) : null
        )}
      </div>
    </div>
  );
}