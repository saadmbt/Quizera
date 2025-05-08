import React from 'react';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';

const AuthRoutes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'Signup',
    element: <Register />,
  },
  {
    path: 'UserRoleSelection',
    element: <UserRoleSelection />,
  }
]

export default AuthRoutes;