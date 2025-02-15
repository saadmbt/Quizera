import React from 'react'
import {Route , createBrowserRouter , createRoutesFromElements , RouterProvider} from'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landingpage from '../pages/Landingpage'
import NotFoundpage from '../pages/NotFoundpage'
const Home = () => {
    const router=createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={<MainLayout/>}>
            <Route index element={<Landingpage/>}/>
            {/* <Route path='/Jobs' element={<Jobspage/>}/>*/}
            <Route path='*' element={<NotFoundpage/>}/> 
        </Route>
      ))
  return <RouterProvider router={router}/>
}

export default Home