import { useState, useEffect, useCallback } from "react";
import { fetchVideos, generateFlashcards } from "../services/StudentService";

export default function useQuizLogic(settings,params) {
  const [quiz, setQuiz] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ListFlashcards, setListFlashcards] = useState([]);
  const [youtubevideos, setyoutubevideos] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showQuestions, setshowQuestions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [QuizResult, setQuizResult] = useState({});
  const [score, setScore] = useState(0);
  const [hasCalledApis, setHasCalledApis] = useState(false);
  // variable in localstorage to check if the quiz result is saved  or not
  const isResultSavedIn = JSON.parse(localStorage.getItem('isResultSaved'));
  const isResultSaverdIn = isResultSavedIn ? " " : localStorage.setItem('isResultSaved',false);
  const Lesson__id = params ? quiz?.lesson_id : settings?.lesson_id;

  // Initialize QuizResult on quiz load
  useEffect(() => {
    if (quiz) {
      setQuizResult({
        lesson_id: Lesson__id , 
        quiz_id: quiz._id,
        title: quiz.title,
        date: quiz.createdAt,
        type: quiz.type,
        questions: [],
      });
    }
  }, [quiz]);

  // Timer effect
  useEffect(() => {
    let interval;
    try {
      interval = setInterval(() => {
        if (quizComplete) {
          clearInterval(interval);
        } else {
          setTimer((prev) => prev + 1);
        }
      }, 1000);
    } catch (err) {
      setError("Timer initialization failed");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizComplete]);

  // Set start time on question change
  useEffect(() => {
    try {
      setStartTime(Date.now());
    } catch (err) {
      setError("Failed to start timer");
    }
  }, [currentQuestion]);

  const handleAnswer = (selectedAnswer) => {
    try {
      const question = quiz.questions[currentQuestion];
      const AnswerByType =
        quiz.type === "fill-blank" &&
        question.blanks &&
        question.blanks.length - 1 > 1
          ? selectedAnswer.split(",")
          : selectedAnswer;
      const isCorrect = AnswerByType === question.correctanswer;
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      const questionRes = {
        id: question.id,
        question: question.question,
        options:
          quiz.type === "fill-blank" ? question?.answers : question?.options,
        correctAnswer: question.correctanswer,
        userAnswer: selectedAnswer,
        isCorrect,
        time: timeSpent,
        explanation: question.explanation,
      };

      setQuizResult((prevQuizResult) => {
        const updatedQuestions = [...prevQuizResult.questions, questionRes];
        const updatedQuizResult = {
          ...prevQuizResult,
          questions: updatedQuestions,
        };
        if (currentQuestion === quiz.questions.length - 1) {
          updatedQuizResult.score = Math.round(
            (score / quiz.questions.length) * 100
          );
          updatedQuizResult.timeSpent = timer;
        }
        return updatedQuizResult;
      });

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setQuizComplete(true);
      }
    } catch (err) {
      console.error("Error in handleAnswer:", err);
      setError("Failed to process answer");
      setTimeout(() => setError(null), 3000);
    }
  };

  const getQuizResult = useCallback(
    (quiz_res_id) => {
      if (hasCalledApis) return; // Skip if already called
      setHasCalledApis(true);
      Promise.all([
        generateFlashcards(Lesson__id, quiz_res_id),
        fetchVideos(Lesson__id, quiz_res_id),
      ])
        .then(([flashcardsResponse, videosResponse]) => {
          if (flashcardsResponse && flashcardsResponse.flashcards) {
            setListFlashcards(flashcardsResponse.flashcards);
          }
          if (videosResponse && videosResponse.youtube_suggestions) {
            setyoutubevideos(videosResponse.youtube_suggestions);
          }
        })
        .catch((error) => {
          console.error("Error fetching flashcards or videos:", error);
        });
    },
    [Lesson__id,hasCalledApis]
  );

  return {
    quiz,
    currentQuestion,
    ListFlashcards,
    youtubevideos,
    timer,
    quizComplete,
    showFlashcards,
    showVideos,
    showQuestions,
    error,
    isLoading,
    QuizResult,
    score,
    setError,
    setIsLoading,
    setQuiz,
    setShowFlashcards,
    setShowVideos,
    setshowQuestions,
    getQuizResult,
    handleAnswer,
  };
}
