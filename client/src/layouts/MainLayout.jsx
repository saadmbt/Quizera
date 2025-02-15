import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from '../components/landingpage/Navbar';
import Footer from '../components/landingpage/Footer';


const MainLayout = () => {
    return (<>
        <Navbar/>
        <Outlet/>
        <Footer/>
      </>
      )
}

export default MainLayout;