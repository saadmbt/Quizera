import { Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

const authRoutes = (
  <Route path="/auth" element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>
);

export default authRoutes;