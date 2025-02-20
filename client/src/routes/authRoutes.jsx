import { Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/login';
import Register from '../pages/Register';

const authRoutes = (
  <Route path="/Auth" element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="Signup" element={<Register />} />
  </Route>
);

export default authRoutes;