import React from 'react'
import {Route , createBrowserRouter , createRoutesFromElements , RouterProvider} from'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landingpage from '../pages/Landingpage'
import NotFoundpage from '../pages/NotFoundpage'
import Contactpage from '../pages/Contactpage'
import authRoutes from './authRoutes'
const Home = () => {
    const router=createBrowserRouter(createRoutesFromElements(
       <>
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<Landingpage/>}/>
            <Route path='/Contact' element={<Contactpage/>}/>
            <Route path='*' element={<NotFoundpage/>}/> 
        </Route>
        {authRoutes}
       </>
        
      ))
  return <RouterProvider router={router}/>
}

export default Home