import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./authRoutes";
import ProfessorRoutes from "./ProfessorRoutes";
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
import Settings from "../components/settings/settings";
import NotAccessibleRoute from "./NotAccessibleRoute";
import Groupspage from "../pages/Dashboard/Groupspage";
import GroupDetailspage from "../pages/Dashboard/GroupDetailspage";
import ProtectedRoute from "./ProtectedRoute";
import JoinQuiz from "../pages/Dashboard/JoinQuiz";
import ProfUpload from "../components/dashbord prof/upload";

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
    const token = localStorage.getItem("access_token");
    const user  = JSON.parse(localStorage.getItem("_us_unr")) || {}

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
      {/* Public routes */}
      <Route path="/" element={(
        <NotAccessibleRoute condition={!token} redirectTo={`/${user.role}`}>
          <MainLayout />
        </NotAccessibleRoute>
      )}>
        {renderRoutes(PublicRoutes)}
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={(
        <NotAccessibleRoute condition={!token} redirectTo={`/${user.role}`}>
          <AuthLayout />
        </NotAccessibleRoute>
      )}>
        {renderRoutes(AuthRoutes)}
      </Route>

      {/* professor routes */}
      <Route
        path="/professor"
        element={<ProtectedRoute allowedRoles={["professor"]}>
                <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="upload" element={<ProfUpload onComplete={onComplete} />} />
        <Route path="upload/quizsetup" element={<QuizSetup onStartQuiz={onStartQuiz} lessonID={lessonID}/>} />
        {renderRoutes(ProfessorRoutes)}
      </Route>

      {/* student routes */}
      <Route
        path="/Student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Studentmainpage />} />
        <Route path="upload" element={<Upload onComplete={onComplete} />} />
        <Route
          path="quiz"
          element={
            <NotAccessibleRoute
              condition={lessonID !== false && quizSettings !== false}
              redirectTo="/Student/upload"
            >
              <Quiz settings={quizSettings} params={false} fromGroup={false}/>
            </NotAccessibleRoute>
          }
        />
        <Route
          path="upload/quizsetup"
          element={
            <NotAccessibleRoute
              condition={lessonID !== false}
              redirectTo="/Student/upload"
            >
              <QuizSetup onStartQuiz={onStartQuiz} lessonID={lessonID} />
            </NotAccessibleRoute>
          }
        />
        <Route path="quiz/:Quiz_id" element={<Quiz settings={{}} params={true} fromGroup={false} />} />
        <Route path="quizzes" element={<Quizzespage />} />
        <Route path="quizzes/:id" element={<QuizDetailspage />} />
        <Route path="flashcards" element={<FlashcardsSection />} />
        <Route path="flashcards/study/:id" element={<FlashcardStudy />} />
        <Route path="groups" element={<Groupspage />} />
        <Route path="groups/:id" element={<GroupDetailspage />} />
        <Route path="groups/quiz/:Quiz_id" element={<Quiz settings={{}} params={true} fromGroup={true} />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFoundpage />} />
      </Route>
      {/* JoinGroup route outside ProtectedRoute to allow setting redirectAfterLogin */}
      <Route path="/Student/join-group/:token" element={<JoinGroup />} />

      <Route path="/JoinQuiz/:Quiz_id" element={<JoinQuiz />} />

      {/* Not Found page */}
      <Route path="*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default Home;
