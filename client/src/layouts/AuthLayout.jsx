import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/landingpage/Navbar';

const AuthLayout = () => {
    return (
        <>
            <Navbar ishowing={false} />
            <Outlet />
        </>
    );
};

export default AuthLayout;