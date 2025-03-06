import { Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';
import SubscriptionPlanSelection from '../pages/SubscriptionPlanSelection';


const authRoutes = (
  <Route path="/Auth" element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="Signup" element={<Register />} />
    <Route path="user-role" element={<UserRoleSelection />} />
    <Route path="subscription-plan" element={<SubscriptionPlanSelection />} />
  </Route>
);

export default authRoutes;
