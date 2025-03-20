import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfDashboard from '../components/dashbord prof/ProfDashboard';
import Groups from '../components/groups/Groups';
import Upload from '../pages/Dashboard/uploadpage';
import Quizzespage from '../pages/Dashboard/Quizzespage';
import Settings from '../components/settings/settings';

const ProfessorRoutes = [
  {
    index: true,
    element: <ProfDashboard />,
  },
  {
    path: 'groups',
    element: <Groups />,
  },
  {
    path: 'upload',
    element: <Upload />,
  },
  {
    path: 'quizzes',
    element: <Quizzespage />,
    },
    {
      path: 'settings',
      element: <Settings/>,
      },
]
  // return (
  //   <Routes>
  //     <Route path="/professor-dashboard" element={<DashboardLayout />}>
  //       
  //     </Route>
  //   </Routes>
  // );


export default ProfessorRoutes;