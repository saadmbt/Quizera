import React from 'react';
import { BrowserRouter as Router, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AuthRoutes from './AuthRoutes';
import ProfessorRoutes from './ProfessorRoutes';
import StudentRoutes from './StudentRoutes';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

const Home = () => { 
  return (
    <Router>
        <Routes>
           {/* Map all routes with their respective layouts */}
           <Route path="/" element={<MainLayout />}>
            {PublicRoutes.map((route,i) => (
                        <Route 
                            key={i}
                                {...(route.index ? { index: true } : { path: route.path })}
                                element={route.element}
                            />
                        ))}
           </Route>
           {/* Auth Routes  */}
           <Route path="/auth" element={<AuthLayout />}>
            {AuthRoutes.map((route,i) => (
                        <Route 
                            key={i}
                            {...(route.index ? { index: true } : { path: route.path })}
                            element={route.element}
                        />
                        ))}
           </Route>
              {/* Professor Routes */}
              <Route path="/professor" element={<DashboardLayout />}>
                {ProfessorRoutes.map((route,i) => (
                            <Route 
                                key={i}
                                {...(route.index ? { index: true } : { path: route.path })}
                                element={route.element}
                            />
                            ))}
             </Route>
                {/* Student Routes */}
                <Route path="/Dashboard" element={<StudentDashboardLayout />}>
                {StudentRoutes.map((route,i) => (
                            <Route 
                                key={i}
                                {...(route.index ? { index: true } : { path: route.path })}
                                element={route.element}
                            />
                            ))}
                </Route>
            
        </Routes>
    </Router>
  )
};

export default Home;