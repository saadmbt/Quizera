import React, { useEffect } from "react";
import MultipleChoice from "../../components/quiz/MultipleChoice";
import FillInBlank from "../../components/quiz/FillInBlank";
import QuizProgress from "../../components/quiz/QuizProgress";
import QuizComplete from "../../components/quiz/QuizComplete";
import Videos from "../../components/dashboard/Videos";
import Flashcards from "../../components/dashboard/Flashcards";
import QuestionReview from "../../components/quiz/QuestionReview";
import LoadingComponent from "../../components/dashboard/LoadingComponent";
import useQuizLogic from "../../hooks/useQuizLogic";
import { generateQuiz } from "../../services/StudentService";

export default function Quiz({settings}) {
  const {
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
  } = useQuizLogic(settings);
      // generate the Quiz by calling the generateQuiz function from the StudentService
  useEffect(() => {
    const getQuiz = async () => {
      try {
        setIsLoading(true);
        const quiz = await generateQuiz(settings);
        console.log('Quiz:', quiz.quiz);
        setQuiz(quiz.quiz);
        } catch (error) {
          setError(error);
        }finally{
          setIsLoading(false);
        }
      };
      getQuiz();
  }
  , [settings]);

  if (isLoading || !quiz || !quiz.questions) {
    return <LoadingComponent />;
  }

  if (showFlashcards) {
    return (
      <Flashcards
        flashcards={ListFlashcards}
        onBack={() => setShowFlashcards(false)}
      />
    );
  }

  if (showVideos) {
    return (
      <Videos videos={youtubevideos} onBack={() => setShowVideos(false)} />
    );
  }

  if (showQuestions && QuizResult.questions) {
    return (
      <QuestionReview
        answers={QuizResult.questions}
        onBack={() => setshowQuestions(false)}
      />
    );
  }

  if (quizComplete) {
    return (
      <QuizComplete
        quizResult={QuizResult}
        score={score}
        totalQuestions={quiz && quiz.questions ? quiz.questions.length : 0}
        onShowFlashcards={() => setShowFlashcards(true)}
        onShowVideos={() => setShowVideos(true)}
        onshowQuestions={() => setshowQuestions(true)}
        getquiz_resualt_id={getQuizResult}
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
        {quiz.type === "fill-blank" ? (
          question ? (
            <FillInBlank
              question={question.question || []}
              answers={question.answers || []}
              blanks={question.blanks || []}
              onAnswer={handleAnswer}
            />
          ) : null
        ) : question ? (
          <MultipleChoice
            question={question.question || []}
            options={question.options || []}
            onAnswer={handleAnswer}
          />
        ) : null}
      </div>
    </div>
  );
}
