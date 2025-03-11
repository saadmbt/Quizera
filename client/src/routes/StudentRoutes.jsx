import { Route } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';
import DashboardLayout from '../layouts/DashboardLayout';

const StudentRoutes = (
  <Route path="/Dashboard" element={<DashboardLayout />}>
    <Route path="upload" element={<Login />} />
    <Route path="Signup" element={<Register />} />
    <Route path="user-role" element={<UserRoleSelection />} />
  </Route>
);

export default StudentRoutes;
