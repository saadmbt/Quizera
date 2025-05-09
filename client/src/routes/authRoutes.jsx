import React from 'react';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';
import ForgetPassword from '../components/Auth/forgetpassword';

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
  },{
    path:'forgetpassword',
    element:<ForgetPassword/>
  }
]

export default AuthRoutes;