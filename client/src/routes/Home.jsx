import React from 'react'
import {Route , createBrowserRouter , createRoutesFromElements , RouterProvider} from'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landingpage from '../pages/Landingpage'
import NotFoundpage from '../pages/NotFoundpage'
import Contactpage from '../pages/Contactpage'
import authRoutes from './authRoutes'
import ProtectedRoute from './ProtectedRoute'
import ProfRoutes from './ProfRoutes'
import StudentRoutes from './StudentRoutes'
const Home = () => {
    const router=createBrowserRouter(createRoutesFromElements(
       <Route>
        {/* Public routes */}
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<Landingpage/>}/>
            <Route path='/Contact' element={<Contactpage/>}/>
            {/* <Route path="/profDash" element={<ProtectedRoute allowedRoles={["professeur"]}>
                { <ProfDashboard/>}
                </ProtectedRoute>}/> */}
                
            <Route path="/studentDash" element={<ProtectedRoute allowedRoles={["student"]}>
                {/* <Studdashbord/> */}
                </ProtectedRoute>}/>
            <Route path='*' element={<NotFoundpage/>}/> 
        </Route>

        {/* Auth routes */}
        {authRoutes}
        {/* Protected routes */}
        {ProfRoutes}
        {StudentRoutes}
        {/*<Route path="dashboard">
            <Route path="professor/*" element={
                <ProtectedRoute allowedRoles={["professeur"]}>
                {ProfRoutes}
                </ProtectedRoute>
            }/>
            <Route path="student/*" element={
                <ProtectedRoute allowedRoles={["student"]}>
                {/* Student routes */} {/*
                </ProtectedRoute>
            }/>
            </Route>*/}
       </Route> 
        
      ))
  return <RouterProvider router={router}/>
}

export default Home