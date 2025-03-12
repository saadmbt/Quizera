import React from 'react'
import {Route , createBrowserRouter , createRoutesFromElements , RouterProvider} from'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landingpage from '../pages/Landingpage'
import NotFoundpage from '../pages/NotFoundpage'
import Contactpage from '../pages/Contactpage'
import authRoutes from './authRoutes'
import ProtectedRoute from './ProtectedRoute'
import ProfRoutes from './ProfRoutes'
const Home = () => {
    const router=createBrowserRouter(createRoutesFromElements(
       <>
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
        {authRoutes}
        {ProfRoutes}
       </>
        
      ))
  return <RouterProvider router={router}/>
}

export default Home