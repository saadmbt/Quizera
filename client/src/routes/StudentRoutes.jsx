import { Route } from 'react-router-dom';
import Login from '../pages/login';
import UserRoleSelection from '../pages/UserRoleSelection';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import Studentmainpage from '../pages/Dashboard/Studentmainpage';
import Quizzespage from '../pages/Dashboard/Quizzespage';

const StudentRoutes =(
    <Route path="/Dashboard" element={<StudentDashboardLayout/>}>
      <Route index element={<Studentmainpage />} />
      <Route path="upload" element={<Login />} />
      <Route path="quizzes" element={<Quizzespage />} />
      <Route path="user-role" element={<UserRoleSelection />} />
    </Route>
  );

export default StudentRoutes;
