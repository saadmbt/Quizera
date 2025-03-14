import { Route } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';
import StudentDashboardLayout from '../layouts/StudentDashboardLayout';
import Studentmainpage from '../pages/Dashboard/Studentmainpage';
import { useEffect } from 'react';

// Initial state based on system preference
const [darkMode, setDarkMode] = useState(() => {
  try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
      return false;
  }
});

// Listen for system theme changes
useEffect(() => {
try {
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handler = (e) => setDarkMode(e.matches);
mediaQuery.addEventListener('change', handler);
return () => mediaQuery.removeEventListener('change', handler);
} catch (err) {
console.warn('Theme detection not supported');
}
}, []);

const StudentRoutes = (
  <Route path="/Dashboard" element={<StudentDashboardLayout />}>
    <Route index element={<Studentmainpage />} />
    <Route path="upload" element={<Login />} />
    <Route path="Signup" element={<Register />} />
    <Route path="user-role" element={<UserRoleSelection />} />
  </Route>
);

export default StudentRoutes;
