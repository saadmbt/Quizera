import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import ProfessorRoutes from "./ProfessorRoutes";
import StudentRoutes, { NotAccessibleRoute } from "./StudentRoutes";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFoundpage from "../pages/NotFoundpage";
// student imports 
import Quiz from "../pages/Dashboard/Quiz";
import QuizSetup from "../pages/Dashboard/QuizSetup";
import Studentmainpage from "../pages/Dashboard/Studentmainpage";
import Upload from "../pages/Dashboard/uploadpage";
import Quizzespage from "../pages/Dashboard/Quizzespage";
import QuizDetailspage from "../pages/Dashboard/QuizDetailspage";
import FlashcardsSection from "../components/dashboard/FlashcardDeckSection";
import FlashcardStudy from "../components/dashboard/FlashCardStudy";
import JoinGroup from "../components/groups/Joingroup";
import QuestionReview from "../components/quiz/QuestionReview";
import QuizComplete from "../components/quiz/QuizComplete";
import Flashcards from "../components/dashboard/Flashcards";
import Videos from "../components/dashboard/Videos";
import Settings from "../components/settings/settings";
import Groups from "../components/groups/Groups";

const renderRoutes = (routes) => {
  return routes.map((route, i) => (
    <Route
      key={i}
      {...(route.index ? { index: true } : { path: route.path })}
      element={route.element}
    />
  ));
};

const Home = () => {
  // State for lessonID and quizSettings from useContext
  const [lessonID, setLessonID] = useState(false);
  const [quizSettings, setQuizSettings] = useState(false);
  const onComplete = (newLessonID) => {
    setLessonID(newLessonID);
  };

  const onStartQuiz = (settings) => {
    setQuizSettings(settings);
  };
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {renderRoutes(PublicRoutes)}
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        {renderRoutes(AuthRoutes)}
      </Route>
      <Route path="/professor" element={<DashboardLayout />}>
        {renderRoutes(ProfessorRoutes)}
      </Route>
      {/* student routes */}
      
      <Route path="/student" element={<StudentDashboardLayout />}>
        <Route index element={<Studentmainpage />} />
        <Route path="upload" element={<Upload onComplete={onComplete} />} />
        <Route path="quiz" element={<NotAccessibleRoute
            condition={lessonID != false && quizSettings != false}
            redirectTo="/Student/upload"
          >
            <Quiz lessonID={lessonID} settings={quizSettings} />
          </NotAccessibleRoute>} />
        <Route path="upload/quizsetup" element={<NotAccessibleRoute
            condition={lessonID != false}
            redirectTo="/Student/upload"
          >
            <QuizSetup onStartQuiz={onStartQuiz} />
          </NotAccessibleRoute>} />
        <Route path="quizzes" element={<Quizzespage headerSet />} />
        <Route path="quizzes/:id" element={<QuizDetailspage />} />
        <Route path="flashcards" element={<FlashcardsSection />} />
        <Route path="flashcards/study/:id" element={<FlashcardStudy />} />
        <Route path="join-group/:token" element={<JoinGroup />} />
        <Route path="groups" element={<Groups/>} />
        <Route path="settings" element={<Settings/>} />
        <Route path="*" element={<NotFoundpage />} />
      </Route>

      {/* Not Found page */}
      <Route path="*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default Home;
