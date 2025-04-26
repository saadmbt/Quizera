import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import ProfessorRoutes from "./ProfessorRoutes";
import { NotAccessibleRoute } from "./StudentRoutes";
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
import ProfUpload from "../components/dashbord prof/Upload";

import Groupspage from "../pages/Dashboard/Groupspage";
import GroupDetailspage from "../pages/Dashboard/GroupDetailspage";
import ProtectedRoute from "./ProtectedRoute";
import JoinQuiz from "../pages/Dashboard/JoinQuiz";

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

      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        {renderRoutes(PublicRoutes)}
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        {renderRoutes(AuthRoutes)}
      </Route>

      {/* professor routes */}
      <Route path="/professor" 
      element={<DashboardLayout />
      //       <ProtectedRoute allowedRoles={["professor"]}>

      //         
      //       </ProtectedRoute>
   }
          >
          <Route path="upload" element={<ProfUpload onComplete={onComplete}/>}/>
        {renderRoutes(ProfessorRoutes)}
      </Route>

      {/* student routes */}
        <Route
          path="/student"
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
                condition={lessonID != false && quizSettings != false}
                redirectTo="/student/upload"
              >
                <Quiz  settings={quizSettings} params={false}/>
              </NotAccessibleRoute>
            }
          />
          <Route
            path="upload/quizsetup"
            element={
              <NotAccessibleRoute
                condition={lessonID != false}
                redirectTo="/student/upload"
              >
                <QuizSetup onStartQuiz={onStartQuiz} lessonID={lessonID} />
              </NotAccessibleRoute>
            }
          />
          <Route path="quiz/:Quiz_id" element={<Quiz settings={{}} params={true} />} />
          <Route path="quizzes" element={<Quizzespage headerSet />} />
          <Route path="quizzes/:id" element={<QuizDetailspage />} />
          <Route path="flashcards" element={<FlashcardsSection />} />
          <Route path="flashcards/study/:id" element={<FlashcardStudy />} />
          <Route path="join-group/:token" element={<JoinGroup />} />
          <Route path="groups" element={<Groupspage />} />
          <Route path="groups/:id" element={<GroupDetailspage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFoundpage />} />
        </Route>
        
        <Route path="/JoinQuiz/:Quiz_id" element={<JoinQuiz />} />
          
      {/* Not Found page */}
      <Route path="*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default Home;
