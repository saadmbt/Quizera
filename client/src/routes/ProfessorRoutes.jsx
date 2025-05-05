import React, { lazy } from 'react';
import ProfDashboard from '../components/dashbord prof/ProfDashboard';
import Groups from '../components/groups/Groups';
import Settings from '../components/settings/settings';
import QuizzesProf from '../components/ProfQuizzes/QuizzesProf';
import ProfQuizzdp from '../components/ProfQuizzes/ProfQuizzdp';
import QuizSetup from '../pages/Dashboard/QuizSetup';
import QuizPreview from '../components/dashbord prof/QuizPreview';
import GroupEditpage from '../pages/Dashboard/GroupEditpage';

const GroupStatistics = lazy(() => import('../pages/Dashboard/GroupStatistics'));

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
    path:'group/:groupid/edit',
    element:<GroupEditpage/>
  },
  {
    path: 'quizzes',
    element: <QuizzesProf />,
  },
  {
    path:'upload/quizpreview',
    element: <QuizPreview />,
  },
  {
    path: 'quizzes/:id',
    element: <ProfQuizzdp />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: 'group/:groupid/statistics',
    element: <GroupStatistics />,
  },
];

export default ProfessorRoutes;