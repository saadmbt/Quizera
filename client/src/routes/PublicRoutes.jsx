import React from 'react';
import Landingpage from '../pages/Landingpage';
import Contactpage from '../pages/Contactpage';
import Aboutpage from '../pages/Aboutpage';

const PublicRoutes =[
  {
    index: true,
    element: <Landingpage />,
  },
  {
    path: 'contact',
    element: <Contactpage />,
  },
  {
    path: 'about',
    element: <Aboutpage />,
  }
]
export default PublicRoutes;
