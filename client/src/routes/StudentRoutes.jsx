import React, { useEffect, useContext, useMemo } from "react";
import Studentmainpage from "../pages/Dashboard/Studentmainpage";
import QuizDetailspage from "../pages/Dashboard/QuizDetailspage";
import FlashcardsSection from "../components/dashboard/FlashcardDeckSection";
import FlashcardStudy from "../components/dashboard/FlashCardStudy";
import QuizSetup from "../pages/Dashboard/QuizSetup";
import Quiz from "../pages/Dashboard/Quiz";
import Upload from "../pages/Dashboard/uploadpage";
import Quizzespage from "../pages/Dashboard/Quizzespage";
import { useNavigate } from "react-router-dom";
import { StateContext } from "./StudentProvider";
import JoinGroup from '../components/groups/Joingroup';

const NotAccessibleRoute = ({ condition, redirectTo, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition) {
      navigate(redirectTo);
    }
  }, [condition, navigate, redirectTo]);

  return condition ? children : null;
};

// Accept props directly instead of using context
const StudentRoutes = ({
  lessonID = false,
  quizSettings = false,
  onComplete = () => console.warn("onComplete not available"),
  onStartQuiz = () => console.warn("onStartQuiz not available"),
}) => {
  console.log("StudentRoutes props:", { lessonID, quizSettings });

  // Memoize routes array to prevent unnecessary re-renders
  return useMemo(
    () => [
      {
        index: true,
        element: <Studentmainpage />,
      },
      {
        path: "upload",
        element: <Upload onComplete={onComplete} />,
      },
      {
        path: "quiz",
        element: (
          <NotAccessibleRoute
            condition={lessonID != false && quizSettings != false}
            redirectTo="/Student/upload"
          >
            <Quiz lessonID={lessonID} settings={quizSettings} />
          </NotAccessibleRoute>
        ),
      },
      {
        path: "upload/quizsetup",
        element: (
          <NotAccessibleRoute
            condition={lessonID != false}
            redirectTo="/Student/upload"
          >
            <QuizSetup onStartQuiz={onStartQuiz} />
          </NotAccessibleRoute>
        ),
      },
      {
        path: "quizzes",
        element: <Quizzespage headerSet />,
      },
      {
        path: "quizzes/:id",
        element: <QuizDetailspage />,
      },
      {
        path: "flashcards",
        element: <FlashcardsSection />,
      },
      {
        path: "flashcards/study/:id",
        element: <FlashcardStudy />,
      },,
      { 
        path: "join-group/:token",
        element: <JoinGroup />,
      }
    ],
    [lessonID, quizSettings, onComplete, onStartQuiz]
  );
};
export default StudentRoutes;

