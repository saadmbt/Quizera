import React from 'react';
import ProfDashboard from '../components/dashbord prof/ProfDashboard';
import Groups from '../components/groups/Groups';
import Settings from '../components/settings/settings';
import QuizzesProf from '../components/ProfQuizzes/QuizzesProf';
import ProfQuizzdp from '../components/ProfQuizzes/ProfQuizzdp';
import QuizSetup from '../pages/Dashboard/QuizSetup';
import QuizPreview from '../components/dashbord prof/QuizPreview';

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
    path: 'quizzes',
    element: <QuizzesProf />,
  },
  {
    path: 'upload/quizsetup',
    element: <QuizSetup />,
  },
  {path:'upload/quizpreview',
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
]

export default ProfessorRoutes;