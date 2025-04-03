import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import ProfessorRoutes from "./ProfessorRoutes";
import StudentRoutes from "./StudentRoutes";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboardLayout from "../layouts/StudentDashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFoundpage from "../pages/NotFoundpage";

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
      <Route path="/student" element={<StudentDashboardLayout />}>
        {renderRoutes(
          StudentRoutes({
            lessonID: false,
            quizSettings: false,
            onComplete: () => console.warn("onComplete not available"),
            onStartQuiz: () => console.warn("onStartQuiz not available"),
          })
        )}
      </Route>
      <Route path="*" element={<NotFoundpage />} />
    </Routes>
  );
};

export default Home;
