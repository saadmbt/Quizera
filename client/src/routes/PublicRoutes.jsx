import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Landingpage from '../pages/Landingpage';
import Contactpage from '../pages/Contactpage';
import NotFoundpage from '../pages/NotFoundpage';

const PublicRoutes =[
  {
    index: true,
    element: <Landingpage />,
  },
  {
    path: 'contact',
    element: <Contactpage />,
  }
]
export default PublicRoutes;